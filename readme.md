# Moment - Mini Social Feed App

<p align="left">
  <img src="./app/assets/images/text-logo.png" alt="Moment App Logo" width="240"/>
</p>

Moment is a lightweight social feed application built for the Mini Social Feed App assignment. It includes a Node.js/Express backend API and a React Native Expo mobile app where users can sign up, log in, publish text posts, browse a shared feed, like posts, comment on posts, filter the feed by username, and receive Firebase push notifications when their own posts receive likes or comments.

## Submission Links

- GitHub repository: [https://github.com/zeon-X/moment-mini-social-app](https://github.com/zeon-X/moment-mini-social-app)
- Android APK: [Download from Google Drive](https://drive.google.com/file/d/1DeEwpxElQ5AtMLS_qUWuLluNR44_9xWA/view?usp=drive_link)
- Backend API docs after running locally: [http://localhost:3008/api/docs](http://localhost:3008/api/docs)

## Project Structure

```text
moment-mini-social-app/
+-- app/       # React Native + Expo mobile application
+-- server/    # Node.js + Express + Prisma backend API
`-- readme.md  # Root project documentation
```

## Tech Stack

**Backend**

- Node.js, Express 5, Prisma ORM
- PostgreSQL
- JWT authentication
- Zod request validation
- Firebase Admin SDK for FCM push notifications
- Swagger/OpenAPI documentation
- Helmet, CORS, rate limiting, Morgan logging

**Mobile App**

- React Native with Expo SDK 54
- Expo Router
- TypeScript
- NativeWind/Tailwind styling
- Expo Secure Store for auth token persistence
- Expo Notifications with Firebase device push tokens
- Socket.IO support for realtime-ready flows

## Features

- Signup and login with JWT authentication
- Authenticated current-user session
- Text-only post creation
- Paginated global feed sorted newest first
- Feed filtering by username/search
- Like/unlike post interaction
- Add comments to posts
- User profiles and community member listing
- In-app notification list, unread count, and mark-as-read API
- Firebase Cloud Messaging notifications when a user's post is liked or commented on
- Mobile screens for onboarding, login, signup, feed, create post, community, notifications, and profile

## Backend Setup

1. Go to the backend folder.

   ```sh
   cd server
   ```

2. Install dependencies.

   ```sh
   npm install
   ```

3. Create the environment file.

   ```sh
   cp .env.example .env
   ```

4. Update `server/.env`.

   ```env
   PORT=3008
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   JWT_SECRET="replace-with-a-long-secure-secret"
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   FIREBASE_SERVICE_ACCOUNT="{...firebase-service-account-json...}"
   ```

   `FIREBASE_SERVICE_ACCOUNT` should be the Firebase Admin SDK service account JSON as a string. This is used by the backend to send FCM notifications.

5. Run database migrations and generate Prisma client.

   ```sh
   npx prisma migrate deploy
   npx prisma generate
   ```

6. Start the backend.

   ```sh
   npm run dev
   ```

The API runs at `http://localhost:3008` by default. Swagger docs are available at `http://localhost:3008/api/docs`.

## Mobile App Setup

1. Go to the Expo app folder.

   ```sh
   cd app
   ```

2. Install dependencies.

   ```sh
   npm install
   ```

3. Create the environment file.

   ```sh
   cp .env.example .env
   ```

4. Update `app/.env`.

   ```env
   EXPO_PUBLIC_ENV="development"
   EXPO_PUBLIC_API_URL="http://YOUR_LOCAL_IP:3008/api/v1"
   ```

   Use your machine's LAN IP instead of `localhost` when testing on a physical Android device.

5. Configure Firebase files for native builds.

   The Expo config expects Firebase files through environment values:

   - `GOOGLE_SERVICES_JSON` for Android
   - `GOOGLE_SERVICE_INFO_PLIST` for iOS

   Push notifications must be tested on a physical device.

6. Start the Expo app.

   ```sh
   npm start
   ```

   Or run Android directly:

   ```sh
   npm run android
   ```

## Build APK

The project includes EAS build profiles in `app/eas.json`. To create an Android APK:

```sh
cd app
npx eas build --platform android --profile preview
```

The submitted APK is available here: [Download Android APK](https://drive.google.com/file/d/1DeEwpxElQ5AtMLS_qUWuLluNR44_9xWA/view?usp=drive_link).

## API Summary

All protected endpoints require:

```http
Authorization: Bearer <jwt-token>
```

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/signup` | No | Register a user with name, email, username, password, and optional age |
| `POST` | `/api/v1/auth/login` | No | Login with email/username and password |
| `GET` | `/api/v1/auth/me` | Yes | Get current authenticated user |
| `GET` | `/api/v1/auth/check-username?username=value` | No | Check username availability |
| `POST` | `/api/v1/auth/fcm-token` | Yes | Save the user's Firebase device token |
| `GET` | `/api/v1/posts?page=1&limit=10` | Yes | Get paginated newest-first feed |
| `GET` | `/api/v1/posts?authorUsername=username` | Yes | Filter feed by exact username |
| `GET` | `/api/v1/posts?search=query` | Yes | Search feed authors by name or username |
| `POST` | `/api/v1/posts` | Yes | Create a text-only post |
| `POST` | `/api/v1/posts/:id/like` | Yes | Like or unlike a post |
| `POST` | `/api/v1/posts/:id/comment` | Yes | Add a comment to a post |
| `GET` | `/api/v1/users` | Yes | List community members |
| `GET` | `/api/v1/users/:username` | Yes | Get user profile with stats and posts |
| `GET` | `/api/v1/notifications` | Yes | Get user notifications |
| `GET` | `/api/v1/notifications/unread-count` | Yes | Get unread notification count |
| `PATCH` | `/api/v1/notifications/:id/read` | Yes | Mark a notification as read |

## Example Requests

Signup:

```sh
curl -X POST http://localhost:3008/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","username":"jane","password":"password123"}'
```

Create a post:

```sh
curl -X POST http://localhost:3008/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{"content":"Hello from Moment!"}'
```

Comment on a post:

```sh
curl -X POST http://localhost:3008/api/v1/posts/<post-id>/comment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{"content":"Nice post!"}'
```

## Notification Flow

1. The mobile app asks for notification permission on a physical device.
2. Expo Notifications retrieves the native Firebase device push token.
3. The app sends that token to `POST /api/v1/auth/fcm-token`.
4. When another user likes or comments on a post, the backend creates a notification record.
5. The backend sends an FCM push notification to the post owner's saved device token.
6. The mobile app also exposes a notifications screen backed by the notifications API.

## Validation and Error Handling

- Backend requests are validated with Zod schemas.
- Protected routes use JWT middleware.
- Passwords are hashed with bcrypt.
- Duplicate email/username signup attempts are rejected.
- Missing posts return a `404`.
- Express global error handling returns consistent API errors.
- Basic rate limiting is enabled to reduce abuse.

## Screenshots

<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/7c9a582f-8608-40af-92e0-132e0c01954b" alt="Feed screen" width="120" height="220"/></td>
    <td><img src="https://github.com/user-attachments/assets/d363b0f1-6807-4c4d-ab61-f6026062b2a7" alt="Community screen" width="120" height="220"/></td>
    <td><img src="https://github.com/user-attachments/assets/4abd783d-66eb-466f-a9e6-d98d7636c5b9" alt="Create post screen" width="120" height="220"/></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/f16cdea6-e1c7-4f67-a673-d123a5993115" alt="Notifications screen" width="120" height="220"/></td>
    <td><img src="https://github.com/user-attachments/assets/8166c1d4-9c70-4a9a-850f-727bbd07907c" alt="Profile screen" width="120" height="220"/></td>
    <td><img src="https://github.com/user-attachments/assets/f003c1af-d204-4354-92e5-abe232fca21b" alt="Push notification" width="120" height="220"/></td>
  </tr>
</table>

## Additional Documentation

- Backend details: [server/README.md](./server/README.md)
- Mobile app details: [app/README.md](./app/README.md)
- OpenAPI spec: [server/docs/openapi.yaml](./server/docs/openapi.yaml)
