# Backend Prometheus monitoring

Spring Boot 4.0.6 manages the version of `io.micrometer:micrometer-registry-prometheus` through its BOM.
Actuator exposes health and prometheus only. GET /actuator/prometheus is allowed on the internal backend port.
Existing health probes, booking POST and restrictions on customer data remain intact.

## Existing stack and discovery

This configuration targets the existing kube-prometheus-stack 92.10.1 installation in namespace monitoring.
No Helm installation or upgrade is required.

- Prometheus serviceMonitorNamespaceSelector: {} discovers ServiceMonitors in all namespaces.
- Prometheus serviceMonitorSelector.matchLabels.release: monitoring selects this monitor's metadata label.
- ServiceMonitor lives in doki-barber and, by default, selects Services in that same namespace.
- Its selector app: barber-backend matches the **Service metadata label**, not just the Service's pod selector.
- The endpoint port http references the Service port name (8080); it scrapes /actuator/prometheus every 30 seconds.

The monitor is deliberately separate from k8s.yaml so applications can deploy without the Operator CRD.

## Manual installation after merge

These commands are for the operator to execute; this change does not automatically merge or deploy.
After merging to dev, wait for successful GHCR publication of both images for the full merge commit SHA.
Use the existing deployment flow to deploy that SHA and update the Service label/port name:

```powershell
.\scripts\deploy-k8s.ps1 -Commit <published-40-character-merge-SHA> -Namespace doki-barber
kubectl --context docker-desktop get crd servicemonitors.monitoring.coreos.com
kubectl --context docker-desktop apply --dry-run=server -f k8s/monitoring/barber-servicemonitor.yaml
kubectl --context docker-desktop apply -f k8s/monitoring/barber-servicemonitor.yaml
kubectl --context docker-desktop -n doki-barber get servicemonitor barber-backend
kubectl --context docker-desktop -n doki-barber get service barber-backend --show-labels
```

Keep the existing PostgreSQL PVC and barber-db Secret. Do not delete/recreate either or reinstall the monitoring stack.
If the updated backend image is already deployed but the Service metadata is not updated, the two Service changes can be applied without touching Deployments or storage:

```powershell
kubectl --context docker-desktop -n doki-barber label service barber-backend app=barber-backend --overwrite
# The JSON patch only adds the name to the existing first (8080) port.
kubectl --context docker-desktop -n doki-barber patch service barber-backend --type=json --patch '[{"op":"add","path":"/spec/ports/0/name","value":"http"}]'
```

## Test the endpoint privately

In a separate terminal (port-forward binds to localhost by default):

```powershell
kubectl --context docker-desktop -n doki-barber port-forward service/barber-backend 18080:8080
```

Then generate harmless traffic and inspect the scrape:

```powershell
curl.exe --fail http://localhost:18080/actuator/health/liveness
curl.exe --fail http://localhost:18080/actuator/health/readiness
curl.exe --fail http://localhost:18080/actuator/prometheus
```

Expect 200 and Prometheus text containing jvm_memory_used_bytes and, after traffic,
http_server_requests_seconds_count / _sum / _max. Counts and latency accumulate per method, URI template and status.
The scrape request itself may only be represented in the next scrape.
Health group requests use the URI template /actuator/health/**; security-rejected requests can have uri="UNKNOWN".
Stop the port-forward with Ctrl+C. No frontend Nginx proxy, public Ingress or host binding is added for metrics.

## Prometheus Targets

```powershell
kubectl --context docker-desktop -n monitoring port-forward service/monitoring-kube-prometheus-prometheus 9090:9090
```

Open http://localhost:9090/targets and find serviceMonitor/doki-barber/barber-backend/0.
Allow at least two scrape intervals for discovery. The target should be UP, with /actuator/prometheus on backend pod port 8080.
Query:

```promql
up{namespace="doki-barber",service="barber-backend"}
```

Missing target: check monitor release label, Prometheus selectors, Service metadata label and named port.
DOWN/403: check deployed image and SecurityConfiguration; DOWN/404: check Actuator exposure and registry dependency.
Connection errors: inspect Service EndpointSlices, backend readiness, and any existing NetworkPolicies between monitoring and doki-barber.
Do not relax booking authorization to fix scraping.

## Grafana PromQL examples

Use Grafana's existing Prometheus data source in Explore or a dashboard.
If needed, access Grafana privately with:

```powershell
kubectl --context docker-desktop -n monitoring port-forward service/monitoring-grafana 3000:80
```

Open http://localhost:3000 using your existing Grafana credentials. Example queries:

Requests per second, grouped by HTTP status (excludes Actuator traffic):

```promql
sum by (status) (
  rate(http_server_requests_seconds_count{namespace="doki-barber",service="barber-backend",uri!~"/actuator/.*"}[5m])
)
```

Request count in the last hour:

```promql
sum(increase(http_server_requests_seconds_count{namespace="doki-barber",service="barber-backend",uri!~"/actuator/.*"}[1h]))
```

Mean latency in seconds, grouped by method and route:

```promql
sum by (method, uri) (rate(http_server_requests_seconds_sum{namespace="doki-barber",service="barber-backend",uri!~"/actuator/.*"}[5m]))
/
sum by (method, uri) (rate(http_server_requests_seconds_count{namespace="doki-barber",service="barber-backend",uri!~"/actuator/.*"}[5m]))
```

JVM heap memory in bytes per pod:

```promql
sum by (pod) (jvm_memory_used_bytes{namespace="doki-barber",service="barber-backend",area="heap"})
```

Rates require multiple samples; routes without requests may have no series and zero traffic yields an undefined mean.
These are default timer count/sum/max metrics. Histogram buckets are not enabled, so percentile/histogram_quantile queries are not supported by this configuration.

## Privacy, tests and verification boundary

No custom customer tags are added. Use low-cardinality method/status/URI template labels, never names, telephone numbers,
email, request bodies, query strings or appointment IDs. Kubernetes namespace/service/pod labels come from target discovery.
Metrics are readable by clients with internal backend network access; they are not an authenticated admin API.

```powershell
cd backend
.\mvnw.cmd -B verify
```

PrometheusMonitoringTests uses a real HTTP server and scrapes the exporter after 200, 400 and 403 responses.
It verifies JVM memory, request count/latency/status, absence of synthetic personal data, health probe availability,
and continued denial of appointment listing, other Actuator endpoints and POST to the metrics endpoint.
It does not create/delete appointments. Existing booking tests continue to run.
CI runs these tests against its isolated PostgreSQL service; local tests default to H2.

Server dry-run validates manifests against the installed CRD but does not install the monitor or prove an UP target.
Live Prometheus collection and Grafana queries must be checked after you deploy the new image and apply the monitor.

References: [Spring Boot metrics](https://docs.spring.io/spring-boot/4.0/reference/actuator/metrics.html),
[ServiceMonitor API](https://prometheus-operator.dev/docs/api-reference/api/#monitoring.coreos.com/v1.ServiceMonitor).
