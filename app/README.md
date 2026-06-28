# Moment Mobile App

React Native Expo mobile client for the Moment Mini Social Feed App.

## Overview

Moment is a lightweight social feed app where users can create an account, log in, browse a shared feed, publish text posts, like and comment on posts, filter the feed by username/search, view community members, manage their profile, and receive push notifications for likes and comments on their own posts.

## Features

- Onboarding, login, and signup screens
- JWT session persistence with Expo Secure Store
- Feed screen with newest-first paginated posts
- Username/search based feed filtering
- Text-only create-post form
- Like/unlike interaction
- Comment creation and comment listing
- Community member screen
- Profile screen with user details/stats
- Notification screen with unread count support
- Firebase push notification registration through Expo Notifications
- Responsive layouts for Android phones and tablets
- TypeScript, Expo Router, NativeWind, and reusable UI components

## Tech Stack

- React Native 0.81
- Expo SDK 54
- Expo Router
- TypeScript
- NativeWind / Tailwind CSS
- Expo Notifications
- Expo Secure Store
- Expo Dev Client
- Socket.IO client

## Folder Structure

```text
app/
|-- assets/
|   `-- images/
|-- src/
|   |-- app/
|   |   |-- (auth)/
|   |   |-- (tabs)/
|   |   |-- _layout.tsx
|   |   |-- global.css
|   |   `-- splash.tsx
|   |-- components/
|   |-- config/
|   |-- constants/
|   |-- context/
|   |-- hooks/
|   |-- services/
|   |-- types/
|   `-- utils/
|-- app.config.js
|-- eas.json
|-- package.json
|-- tailwind.config.js
`-- tsconfig.json
```

## Environment Variables

Copy the example file:

```sh
cp .env.example .env
```

Set the API base URL:

```env
EXPO_PUBLIC_ENV="development"
EXPO_PUBLIC_API_URL="http://YOUR_LOCAL_IP:3008/api/v1"
```

Use your computer's LAN IP when testing on a physical Android device. `localhost` points to the device itself, not your development machine.

## Firebase Configuration

Push notifications require a Firebase project and a physical device.

The Expo config reads Firebase native files from environment values:

```env
GOOGLE_SERVICES_JSON="path-or-eas-secret-value-for-google-services.json"
GOOGLE_SERVICE_INFO_PLIST="path-or-eas-secret-value-for-GoogleService-Info.plist"
```

For EAS builds, `app/eas.json` expects these as EAS secrets:

- `GOOGLE_SERVICES_JSON`
- `GOOGLE_SERVICE_INFO_PLIST`

The app registers for push notifications, retrieves the Firebase device push token with `expo-notifications`, and sends it to the backend through `POST /api/v1/auth/fcm-token`.

## Local Setup

From the repository root:

```sh
cd app
npm install
npm start
```

Useful Expo commands:

```sh
npm run android
npm run ios
npm run web
```

Android and iOS native notification behavior should be tested with a development build or APK on a physical device.

## APK Build

Create an Android APK with the preview build profile:

```sh
cd app
npx eas build --platform android --profile preview
```

The submitted APK is available here:

[Download Android APK](https://drive.google.com/file/d/1DeEwpxElQ5AtMLS_qUWuLluNR44_9xWA/view?usp=drive_link)

## Backend Dependency

The app expects the backend API to be running and reachable at:

```text
EXPO_PUBLIC_API_URL
```

Default local backend:

```text
http://localhost:3008/api/v1
```

Physical Android device example:

```text
http://192.168.0.105:3008/api/v1
```

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start Expo development server |
| `npm run android` | Run Android native build locally |
| `npm run ios` | Run iOS native build locally |
| `npm run web` | Run Expo web |
| `npm run lint` | Run Expo ESLint checks |
| `npm run reset-project` | Run the project reset helper script |

## Tests and Lint Verification

Current verification commands for reviewers:

```sh
cd app
npm run lint
npx tsc --noEmit
```

Expected status:

- `npm run lint` runs Expo linting.
- `npx tsc --noEmit` performs TypeScript type checking.
- No automated mobile unit/integration test suite is configured yet.

Recommended next step for production readiness: add Jest/React Native Testing Library coverage for auth forms, feed rendering, post creation, like/comment interactions, and notification state.

## Main Screens

- `src/app/(auth)/onboarding.tsx`
- `src/app/(auth)/login.tsx`
- `src/app/(auth)/register.tsx`
- `src/app/(tabs)/index.tsx`
- `src/app/(tabs)/create-post.tsx`
- `src/app/(tabs)/community.tsx`
- `src/app/(tabs)/notifications.tsx`
- `src/app/(tabs)/profile.tsx`

## Related Documentation

- Root README: [../readme.md](../readme.md)
- Backend README: [../server/README.md](../server/README.md)
- Backend OpenAPI spec: [../server/docs/openapi.yaml](../server/docs/openapi.yaml)
