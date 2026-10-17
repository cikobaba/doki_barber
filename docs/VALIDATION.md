# Validation report — 2026-10-17

## Implemented and changed files

- CI/GHCR: .github/workflows/ci.yml.
- Containers/network/storage: compose.yaml, backend/Dockerfile, frontend/Dockerfile, both .dockerignore files, frontend/nginx.conf.
- Kubernetes: k8s.yaml, scripts/deploy-k8s.ps1.
- Backend: pom.xml, application.properties, SecurityConfiguration, appointment entity/controller/request/error handler, Flyway V1 migration.
- Tests: BookingApiTests, test application.properties, frontend/tests/booking.test.js.
- Frontend: BookingForm.jsx, booking.js, App.jsx (accurate confirmation copy), vite.config.js, package.json and package-lock.json.
- Configuration/documentation: .gitignore, .env.example, README, frontend README and docs/*.md.

## Verified locally

| Check | Result |
| --- | --- |
| Maven verify with H2 test database | 8 tests passed; JAR built |
| Same Maven API suite against isolated PostgreSQL 17 | 8 tests passed |
| Concurrency | Two simultaneous bookings: exactly one 201 and one 409 |
| npm ci, lint, test, build | Passed; 4 frontend tests |
| npm audit fix | Compatible transitive updates; 0 reported vulnerabilities |
| Both production Docker image builds | Passed |
| Container identity | Backend UID 10001, Nginx UID 101 |
| Compose config and up --wait | Passed in isolated doki-validation project |
| Nginx-to-API request | Create 201, duplicate 409, listing 403 |
| PostgreSQL/backend restart | Existing test appointment remained |
| Playwright browser | Real successful submission; duplicate error; no false success |
| Mobile viewport | 390px wide, no horizontal page overflow; screenshot inspected |
| GitHub Actions actionlint | Passed |
| Kubernetes server dry-run | All 7 resources accepted by Docker Desktop cluster |
| PowerShell deployment script | Syntax parsed successfully |
| git diff --check | Passed |

Only synthetic test customers were used. Existing cluster resources and their data were not modified.
Local test credentials are randomly generated and stored only in ignored .env.validation.

## Limitations and manual steps

- GHCR publishing has not been exercised locally. Merge/push to dev and verify both SHA-tagged images in Actions/GHCR.
- Configure package visibility (public for credential-free pulls), or a private image pull Secret.
- Create a local .env password and Kubernetes barber-db Secret; run the deployment script with the published full commit SHA.
- Kubernetes validation was a **server dry-run**, not a rollout or image-pull test. The deployment script's live rollout remains unverified.
- No automatic deployment to Docker Desktop is configured.
- Listing is intentionally forbidden; there is no admin UI/login. WhatsApp/reminders remain future work.
- Existing H2 records are not migrated automatically; export any needed live data before replacing the old application.
- Vite reports the existing large Three.js chunk (>500 kB). Visual assets and design were preserved.
- Browser console's 409 network error is expected during the duplicate-booking test; no personal data is logged by application code.
