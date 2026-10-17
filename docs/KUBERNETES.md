# Docker Desktop Kubernetes

The manifest uses ClusterIP services, a development PostgreSQL Deployment/PVC, probes and resource budgets.
This is a single-instance development database, not a production HA/backup solution.
No GitHub-hosted runner is connected to your local cluster.

## Prepare

1. Enable Docker Desktop Kubernetes; check `kubectl --context docker-desktop get nodes`.
2. Merge the PR into dev and wait for both GHCR images with the same full commit SHA.
3. Make both GHCR packages public for credential-free pulls. If kept private, create a registry pull Secret locally and attach it to the namespace's service account; never commit the token.
4. Create a namespace and a local database secret:

```powershell
kubectl --context docker-desktop create namespace doki-barber
# Reuse your ignored .env (POSTGRES_DB must be barber for this manifest).
# Extra FRONTEND_PORT key is harmless; never commit this Secret.
kubectl --context docker-desktop -n doki-barber create secret generic barber-db --from-env-file=.env
.\scripts\deploy-k8s.ps1 -Commit <full-40-character-published-commit>
kubectl --context docker-desktop -n doki-barber port-forward service/barber-frontend 5173:80
```

Open http://localhost:5173. Use another local port if Compose is running.
The script replaces :dev references in memory with immutable sha-<commit> tags before applying.
Run the same command with a newer SHA to update or an earlier compatible SHA to roll back.
The raw manifest has :dev + Always for convenient development; prefer the script for repeatable releases.
Do not use docker save, kubectl cp or ctr import.

## Validate without deployment

```powershell
kubectl --context docker-desktop apply --dry-run=server -f k8s.yaml
```

A dry run confirms schema/admission validation, not successful image pulling or startup.

## Troubleshooting

- ImagePullBackOff: check that both SHA tags were published, visibility is public or imagePullSecrets is configured.
- CreateContainerConfigError: verify barber-db Secret exists in the same namespace.
- Pending PVC: check Docker Desktop's default StorageClass and available disk.
- Backend not ready: inspect pod logs, DB credentials, PostgreSQL readiness and migration errors.
- 502: inspect backend readiness and barber-backend Service endpoints.
- Startup probes allow up to five minutes; liveness excludes the database to avoid restarting the API during a DB outage.
- Check `kubectl -n doki-barber get pods,svc,pvc` and `kubectl -n doki-barber describe pod <name>`.
- Updating POSTGRES_PASSWORD in a Secret does not change an existing PostgreSQL user's password. Rotate the database password explicitly and coordinate backend rollout.

Never delete a namespace/PVC to fix an application rollout; back up existing data first.
Kubernetes Secrets are not encryption by themselves. Keep credentials out of source control and limit cluster access.
