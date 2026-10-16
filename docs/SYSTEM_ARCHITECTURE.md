# Architecture

Browser → Nginx :8080 → /api → Spring Boot :8080 → PostgreSQL :5432.

Nginx serves the existing Vite build and proxies API requests using barber-backend DNS.
Compose supplies that network alias; Kubernetes supplies a Service with the same name.
Local Vite development has an equivalent /api proxy.

Spring MVC validates a dedicated request record, saves through Spring Data JPA, and returns a minimal confirmation.
Flyway owns the database schema; Hibernate validates it. Database uniqueness is the concurrency boundary.
Spring Security allows only public booking POST and health GET, with no admin interface.

Compose uses a named database volume. Kubernetes uses a PVC with a single PostgreSQL Deployment.
CI validates and publishes containers; deployment to a local cluster is an explicit operator action.
