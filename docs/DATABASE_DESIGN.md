# Database

Flyway V1 creates appointments with identity id, full_name, phone, email, service, date, time, note and created_at.
The unique constraint uk_appointment_slot(date,time) provides race-safe booking. Each slot is one hour for one barber.
Times and creation timestamps use the shop's timezone convention (Europe/Istanbul).

Runtime storage is PostgreSQL 17. H2 is test-only.
Hibernate ddl-auto=validate never creates or rewrites production tables.
Do not edit already-applied migration files; introduce versioned migrations for future schema changes.

The old H2 memory database cannot persist across restart. No automatic historical-data migration is supplied.
Export records from any still-running old instance before replacement and reconcile duplicate slots before import.
Flyway baseline-on-migrate is intentionally not enabled.
Back up PostgreSQL with pg_dump before migration and test restoring backups separately.
