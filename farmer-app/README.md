# Harvest Hold Farmer App (React Native)

Mobile farmer app for monitoring SHCCS coolers, alerts, and technician help requests.

## Stack

- **React Native** (Expo)
- **NativeWind** (Tailwind CSS for React Native)
- **Java Spring Boot** API in `../backend`
- Fonts: **Fraunces** + **Sora**

## Languages

English, Kinyarwanda, French.

Default language = **device system language** (`en` / `rw` / `fr`).  
Override anytime on Login or Profile (or choose System default).

## Notifications & toasts

- Toast messages on login, errors, help tickets, language change
- Push permission + Expo push token registered to Java API (`/device-tokens`)
- Local push when unread alert count increases (8s poll on home, 5s on unit detail)

## Backend on LAN

API binds to `0.0.0.0:8080` and is reachable at:

`http://192.168.0.115:8080`

```bash
cd backend && ./mvnw spring-boot:run
```

The APK is built against that LAN URL (see `.env` and `src/api/client.js`).

## APK

Release APK (LAN API baked in):

`farmer-app/dist/HarvestHold-Farmer-192.168.0.115.apk`

Rebuild:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export EXPO_PUBLIC_API_URL=http://192.168.0.115:8080
cd farmer-app/android && ./gradlew assembleRelease
```

Phone must be on the same Wi‑Fi as this machine.

## Run (dev)

```bash
# Terminal 1 — Java API
cd backend && ./mvnw spring-boot:run

# Terminal 2 — Farmer app
cd farmer-app && npm start
```

Demo login: `+250 788 123 456` / `1234`
