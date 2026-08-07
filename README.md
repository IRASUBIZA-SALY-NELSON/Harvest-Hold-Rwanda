# Harvest Hold Rwanda

IoT + AI cold-chain platform for smallholder farmers in Rwanda.

## Monorepo

| Folder | What |
|--------|------|
| `Website/` | Marketing site (React + Vite) |
| `farmer-app/` | Farmer mobile app (Expo / React Native) |
| `admin-dashboard/` | Ops dashboard with live charts (React + Recharts) |
| `backend/` | Spring Boot API (shared by mobile + admin) |

## Quick start

```bash
# API (required for mobile + admin)
cd backend && ./mvnw spring-boot:run

# Admin dashboard → http://127.0.0.1:5174
cd admin-dashboard && npm install && npm run dev

# Website
cd Website && npm install && npm run dev

# Farmer app
cd farmer-app && npm install && npx expo start
```

## Demo logins

**Farmer app:** `+250 788 123 456` / `1234`  
**Admin dashboard:** `admin@harvesthold.rw` / `admin1234`
