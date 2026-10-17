# Doki Barber / Doğukan Hair Men's Club

React 19 + Vite storefront, Java 17 / Spring Boot 4 API, PostgreSQL 17 storage.
The existing responsive design and 3D sections are preserved.

## Implemented

- Public appointment creation through same-origin `POST /api/appointments`.
- Loading/error/confirmation states; no customer data in browser logs.
- Validation in shop timezone **Europe/Istanbul**; one single-barber, one-hour slot per date, 10:00–18:00 inclusive.
- PostgreSQL unique constraint prevents concurrent double booking; conflicts return 409.
- Flyway migrations and persistent Docker volume / Kubernetes PVC.
- Spring Security denies appointment retrieval and all non-public endpoints. No admin login or admin UI is implemented.
- Actuator startup/liveness/readiness probes; readiness checks database connectivity.
- CI tests, lint, builds, Docker validation and conditional GHCR publishing.

WhatsApp messages, reminders, cancellation, multiple barbers and automated local Kubernetes deployment are **not implemented**.

## Run with Docker Compose (PowerShell)

```powershell
Copy-Item .env.example .env
# Edit .env and set a unique POSTGRES_PASSWORD.
docker compose config --quiet
docker compose up --build -d --wait
```

Open http://localhost:5173. Nginx proxies /api to the backend; database and backend are not published on host ports.
Set FRONTEND_PORT in .env to change the port. Stop with `docker compose down`; the database volume is retained.
Do not run `down -v` or delete PVCs unless you explicitly intend to destroy data.

Existing in-memory H2 data is not automatically imported. Export any live records before replacing an old deployment.
Flyway deliberately refuses a non-empty unmanaged schema rather than silently baselining or overwriting it.

## Local development and tests

Node 22 and JDK 17 are required. Set DB_URL, DB_USER and DB_PASSWORD to a development PostgreSQL database, then:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
# Separate terminal:
cd frontend
npm ci
npm run dev
```

Vite proxies /api to localhost:8080. Browser code never contains a backend hostname.
Production uses Nginx and the shared DNS name barber-backend in both Compose and Kubernetes.

```powershell
cd backend
.\mvnw.cmd verify
cd ../frontend
npm ci
npm run lint
npm test
npm run build
```

Local backend tests default to disposable in-memory H2 in PostgreSQL compatibility mode. CI runs the same API/concurrency tests against PostgreSQL.
To run locally against PostgreSQL, set TEST_DB_URL, TEST_DB_USER, TEST_DB_PASSWORD to a **dedicated disposable test database**; tests delete appointments.

## Environment

| Variable | Use |
| --- | --- |
| POSTGRES_DB / POSTGRES_USER | Compose database/name, default barber |
| POSTGRES_PASSWORD | Required local password, no committed default |
| FRONTEND_PORT | Compose host port, default 5173, bound to loopback |
| DB_URL / DB_USER / DB_PASSWORD | Backend JDBC connection |
| BOOKING_ZONE | Backend timezone, default Europe/Istanbul; keep aligned with UI |
| TEST_DB_URL / TEST_DB_USER / TEST_DB_PASSWORD | Optional dedicated backend test database |

## CI and GHCR

The default integration branch is **dev**. Work on feature branches and open PRs into dev.
Pushes to dev/main and PRs targeting them run backend tests/build and frontend lint/tests/build.
Both Docker builds must succeed before publishing can start. PRs never log in or publish.
Only the publish job gets packages:write; everything else has contents:read.
Publishing uses GITHUB_TOKEN, with no PAT or repository password needed.

Images:
- ghcr.io/cikobaba/doki_barber-backend:sha-<full-commit>
- ghcr.io/cikobaba/doki_barber-frontend:sha-<full-commit>

Pushes to dev also update :dev. Use matching SHA tags for deployment/rollback.
BuildKit caches are scoped per component. Registry outages can still cause partial publishing; verify **both** SHA images exist before deploying.
GHCR publishing is triggered after merge/push, not by local builds. Package visibility and Actions permissions may need repository-owner configuration.

See [Kubernetes deployment](docs/KUBERNETES.md), [API](docs/API_DESIGN.md),
[architecture](docs/SYSTEM_ARCHITECTURE.md), [database](docs/DATABASE_DESIGN.md), and [validation report](docs/VALIDATION.md).
