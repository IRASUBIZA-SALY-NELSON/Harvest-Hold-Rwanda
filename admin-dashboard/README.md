# Harvest Hold · Admin Dashboard

Professional operations console for the SHCCS cooling fleet.

## Run

1. Start the API: `cd ../backend && ./mvnw spring-boot:run`
2. Start the dashboard: `npm run dev` → http://127.0.0.1:5174

## Demo login

- Email: `admin@harvesthold.rw`
- Password: `admin1234`

## Features

- Live overview KPIs (units, farmers, alerts, avg temp/humidity)
- Realtime charts (temp & humidity trends, status mix, district coverage, chamber snapshot)
- Fleet detail with per-unit sensor history
- Farmer roster
- Network alert stream
- Support ticket queue (status updates sync with farmer help tickets)

Data refreshes every ~4 seconds from the Spring Boot telemetry simulator.
