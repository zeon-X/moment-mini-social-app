# Moment Backend API

Node.js, Express, Prisma, PostgreSQL, JWT, and Firebase Admin backend for the Moment Mini Social Feed App.

## Overview

The backend exposes authenticated REST APIs for user signup/login, text posts, likes, comments, community members, user profiles, and notifications. It also stores Firebase device tokens and sends FCM push notifications when a user's post receives a like or comment.

## Features

- JWT signup/login using email or username
- Password hashing with bcrypt
- Protected routes via bearer token middleware
- Zod validation for auth, post, comment, and FCM token payloads
- Text-only posts with 280 character validation
- Paginated newest-first feed
- Feed filtering by exact `authorUsername` or author `search`
- Like/unlike toggle endpoint
- Comment creation endpoint
- User profile stats and community member list
- Notification records, unread count, mark-as-read, Socket.IO emit hooks, and FCM push delivery
- Swagger UI generated from `docs/openapi.yaml`
- Basic production hardening with Helmet, CORS, rate limiting, and centralized error handling

## Tech Stack

- Node.js with ES modules
- Express 5
- Prisma ORM
- PostgreSQL
- Firebase Admin SDK
- Zod
- Socket.IO
- Swagger UI / OpenAPI YAML

## Folder Structure

```text
server/
|-- docs/
|   `-- openapi.yaml
|-- prisma/
|   |-- migrations/
|   `-- schema.prisma
|-- src/
|   |-- config/
|   |-- middlewares/
|   |-- modules/
|   |   |-- auth/
|   |   |-- notification/
|   |   |-- post/
|   |   `-- user/
|   |-- socket/
|   |-- utils/
|   |-- app.js
|   `-- server.js
|-- package.json
`-- README.md
```

## Environment Variables

Copy the example file and update the values:

```sh
cp .env.example .env
```

Required variables:

```env
CORS_ORIGIN=*
PORT=3008
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="replace-with-a-long-secure-secret"
JWT_EXPIRES_IN=7d
NODE_ENV=development
FIREBASE_SERVICE_ACCOUNT="{...firebase-admin-service-account-json...}"
```

`FIREBASE_SERVICE_ACCOUNT` is parsed as JSON by `src/config/firebase.js`, so keep it as a valid JSON string in the environment.

## Local Setup

From the repository root:

```sh
cd server
npm install
npx prisma migrate deploy
npx prisma generate
npm run dev
```

The backend runs on `http://localhost:3008` by default.

## API Documentation

Swagger UI is available after starting the server:

[http://localhost:3008/api/docs](http://localhost:3008/api/docs)

The raw OpenAPI file lives at:

```text
server/docs/openapi.yaml
```

## Key Endpoints

All protected routes require:

```http
Authorization: Bearer <jwt-token>
```

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | No | API health check |
| `GET` | `/health/db` | No | Database health check |
| `POST` | `/api/v1/auth/signup` | No | Register a user |
| `POST` | `/api/v1/auth/login` | No | Login with email/username and password |
| `GET` | `/api/v1/auth/me` | Yes | Get current user |
| `GET` | `/api/v1/auth/check-username?username=value` | No | Check username availability |
| `POST` | `/api/v1/auth/fcm-token` | Yes | Save Firebase device token |
| `GET` | `/api/v1/posts?page=1&limit=10` | Yes | Get paginated feed |
| `GET` | `/api/v1/posts?authorUsername=value` | Yes | Filter feed by exact username |
| `GET` | `/api/v1/posts?search=value` | Yes | Search authors by name or username |
| `POST` | `/api/v1/posts` | Yes | Create a text post |
| `POST` | `/api/v1/posts/:id/like` | Yes | Like or unlike a post |
| `POST` | `/api/v1/posts/:id/comment` | Yes | Add a comment |
| `GET` | `/api/v1/users` | Yes | Get community members |
| `GET` | `/api/v1/users/:username` | Yes | Get user profile |
| `GET` | `/api/v1/notifications` | Yes | Get notifications |
| `GET` | `/api/v1/notifications/unread-count` | Yes | Get unread notification count |
| `PATCH` | `/api/v1/notifications/:id/read` | Yes | Mark notification as read |

## Notification Flow

1. The Expo app gets the physical device push token.
2. The app sends the token to `POST /api/v1/auth/fcm-token`.
3. When another user likes or comments on a post, the backend creates a notification record.
4. The notification service emits a Socket.IO event for connected clients.
5. The notification service sends an FCM push notification to the post owner's stored token.
6. Invalid FCM tokens are cleared when Firebase reports an unregistered token.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm start` | Run migrations, then start the API |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Create/apply a development migration |
| `npm test` | Placeholder script; no automated backend tests are configured yet |

## Tests and Lint Verification

Current verification commands for reviewers:

```sh
cd server
npx prisma validate
npm run prisma:generate
npm test
```

Expected status:

- `npx prisma validate` should pass when `DATABASE_URL` is present.
- `npm run prisma:generate` should pass after dependencies are installed.
- `npm test` currently exits with the package placeholder message: `Error: no test specified`.
- A backend lint script is not configured yet.

Recommended next step for production readiness: add unit/integration tests for auth, post interactions, notification creation, and protected route failures, then replace the placeholder `npm test` script.
