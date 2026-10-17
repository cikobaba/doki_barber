# API

## POST /api/appointments (public)

JSON fields: fullName (required, up to 100), phone (required, 7–30 phone characters), email (optional, valid email, up to 254),
service (one of Saç Kesimi, Sakal Bakımı, Klasik Tıraş, Saç Bakımı, Premium Hizmet),
date (YYYY-MM-DD), time (HH:mm), note (optional, up to 1000).

Dates/times are shop-local Europe/Istanbul. Only future appointments and whole-hour slots 10:00–18:00 are accepted.
One barber serves one customer per hour, regardless of service.

201 returns only {id,date,time}; customer name, phone, email and notes are not echoed.
400 indicates invalid/malformed input or past/off-grid time. 409 indicates an occupied slot.
Error bodies contain a user-safe message, never SQL or exception details.

## Restricted endpoints

GET /api/appointments returns 403; listing is deliberately unavailable until an established admin authentication flow is implemented.
Other application paths and H2 console are denied. Cross-origin API access is not enabled.
Public booking uses JSON with no session/cookie authentication; CSRF is excluded only for the booking endpoint.
Do not add cookie-based privileged actions to this endpoint without revisiting CSRF protection.

## Health (internal backend port)

GET /actuator/health, /actuator/health/liveness, /actuator/health/readiness.
Only status is exposed; readiness includes the database. Nginx exposes /healthz for its own probe.

GET /actuator/prometheus exports internal HTTP/JVM metrics for Prometheus. It is not proxied by Nginx.
See [monitoring setup and queries](MONITORING.md). Other Actuator endpoints remain denied.
