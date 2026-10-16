# Scope and requirements

The application supports one shop and one concurrently bookable barber.
Opening slots are hourly from 10:00 through 18:00, interpreted in Europe/Istanbul.
All services consume one slot; holidays and varying service durations are not modeled.
Contact information is stored privately; anonymous listing is prohibited.
The responsive visual design is retained.

This is a local development/portfolio deployment. Public production hosting additionally needs TLS,
abuse/rate-limit controls, backup/restore operations and an appropriate personal-data retention policy.
No admin login, WhatsApp integration or automatic local-cluster CD is included.
