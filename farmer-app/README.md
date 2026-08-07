# Harvest Hold Farmer App (React Native)

Mobile farmer app for monitoring SHCCS coolers, alerts, and technician help requests.

## Stack

- **React Native** (Expo)
- **NativeWind** (Tailwind CSS for React Native)
- **Java Spring Boot** API in `../backend` (also hosted on Render)
- Fonts: **Fraunces** + **Sora**

## Languages

English, Kinyarwanda, French.

Default language = **device system language** (`en` / `rw` / `fr`).  
Override anytime on Login or Profile (or choose System default).

## Notifications & toasts

- Toast messages on login, errors, help tickets, language change
- Push permission + Expo push token registered to Java API (`/device-tokens`)
- Local push when unread alert count increases (8s poll on home, 5s on unit detail)

## Backend

Default API (baked into release APK):

`https://harvest-hold-rwanda.onrender.com`

Override with `EXPO_PUBLIC_API_URL` in `.env` (see `.env.example`).

## APK

Release APK:

`farmer-app/dist/HarvestHold-Farmer.apk`

Rebuild:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export EXPO_PUBLIC_API_URL=https://harvest-hold-rwanda.onrender.com
cd farmer-app/android && ./gradlew assembleRelease
```

Phone needs internet access (API is on Render). First request after idle may be slow while Render wakes up.

## Run (dev)

```bash
cd farmer-app && npm start
```

Demo login: `+250 788 123 456` / `1234`
