package com.mastersharli.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;

// Real HTTP requests exercise the servlet observation filter and Prometheus exporter.
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PrometheusMonitoringTests {
    @LocalServerPort int port;
    private final HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();

    private HttpResponse<String> request(String method, String path, String body) throws Exception {
        return client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + path))
                .timeout(Duration.ofSeconds(10))
                .header("Content-Type", "application/json")
                .method(method, HttpRequest.BodyPublishers.ofString(body)).build(),
                HttpResponse.BodyHandlers.ofString());
    }

    @Test
    void exportsRequestCountLatencyStatusAndJvmMemoryWithoutPersonalData() throws Exception {
        assertThat(request("GET", "/actuator/health/liveness", "").statusCode()).isEqualTo(200);
        String personalData = """
                {"fullName":"MetricsPrivacyCanary","phone":"+905559876543",
                 "email":"metrics-canary@example.com","note":"PrivateNoteCanary"}
                """;
        // Invalid booking exercises the real API without creating or deleting data.
        assertThat(request("POST", "/api/appointments?email=query-canary@example.com", personalData)
                .statusCode()).isEqualTo(400);
        assertThat(request("GET", "/api/appointments", "").statusCode()).isEqualTo(403);

        HttpResponse<String> scrape = request("GET", "/actuator/prometheus", "");
        assertThat(scrape.statusCode()).isEqualTo(200);
        assertThat(scrape.headers().firstValue("content-type").orElse("")).contains("text/plain");
        String metrics = scrape.body();
        assertThat(metrics).contains("jvm_memory_used_bytes{", "http_server_requests_seconds_count{",
                "http_server_requests_seconds_sum{", "http_server_requests_seconds_max{");
        assertThat(metrics.lines().filter(line -> line.startsWith("http_server_requests_seconds_count{")))
                .anyMatch(line -> line.contains("status=\"200\"") && line.contains("uri=\"/actuator/health/**\""))
                .anyMatch(line -> line.contains("status=\"400\"") && line.contains("uri=\"/api/appointments\""))
                .anyMatch(line -> line.contains("status=\"403\""));
        for (String metric : new String[]{"http_server_requests_seconds_count{", "http_server_requests_seconds_sum{"}) {
            assertThat(metrics.lines().filter(line -> line.startsWith(metric)
                    && line.contains("uri=\"/api/appointments\"")))
                    .anyMatch(line -> Double.parseDouble(line.substring(line.lastIndexOf(' ') + 1)) > 0);
        }
        assertThat(metrics).doesNotContain("MetricsPrivacyCanary", "+905559876543", "metrics-canary@example.com",
                "PrivateNoteCanary", "query-canary@example.com");
    }

    @Test
    void monitoringDoesNotOpenOtherEndpointsOrMethods() throws Exception {
        for (String path : new String[]{"/actuator/env", "/actuator/metrics", "/api/appointments", "/h2-console"}) {
            assertThat(request("GET", path, "").statusCode()).as(path).isEqualTo(403);
        }
        assertThat(request("POST", "/actuator/prometheus", "{}").statusCode()).isEqualTo(403);
        assertThat(request("GET", "/actuator/health/readiness", "").statusCode()).isEqualTo(200);
    }
}
