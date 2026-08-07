# Harvest Hold API (Java)

Spring Boot backend for Harvest Hold apps (farmer mobile, admin dashboard).

## Run

```bash
./mvnw spring-boot:run
```

Health check: `GET http://127.0.0.1:8080/api/health`

Live IoT telemetry is simulated every ~4 seconds so dashboards and the farmer app show changing temperatures, humidity, and alerts.

## Farmer endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | `{ "phone", "pin" }` |
| GET | `/api/farmers/{id}/units` | List cooler units |
| GET | `/api/farmers/{id}/units/{unitId}` | Unit detail |
| GET | `/api/farmers/{id}/alerts` | Alerts |
| PATCH | `/api/farmers/{id}/alerts/{alertId}/read` | Mark read |
| PATCH | `/api/farmers/{id}/alerts/read-all` | Mark all read |
| GET | `/api/farmers/{id}/help` | Help tickets |
| POST | `/api/farmers/{id}/help` | Create ticket |

## Admin endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/auth/login` | `{ "email", "password" }` |
| GET | `/api/admin/overview` | KPIs + chart series (live) |
| GET | `/api/admin/units` | Full fleet with farmer context |
| GET | `/api/admin/units/{id}` | Single unit detail |
| GET | `/api/admin/farmers` | Farmer roster |
| GET | `/api/admin/alerts` | Network alerts |
| GET | `/api/admin/tickets` | Help tickets |
| PATCH | `/api/admin/tickets/{id}` | `{ "status" }` — Open / In Progress / Resolved / Closed |

## Demo credentials

**Farmer**

- Phone: `+250 788 123 456`
- PIN: `1234`

**Admin**

- Email: `admin@harvesthold.rw`
- Password: `admin1234`

H2 console: `/h2-console` (jdbc:h2:mem:harvesthold)
