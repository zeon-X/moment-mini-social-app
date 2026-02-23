# Moment Mini Social Media App

<!-- Logo Placeholder -->
<p align="center">
  <img src="./app/assets/images/icon.png" alt="Moment App Logo" width="120"/>
</p>

## Overview

**Moment Mini Social Media App** is a modern, cross-platform social media platform featuring a mobile client (React Native + Expo) and a Node.js/Express backend API. The project is modular, scalable, and designed for rapid development and extensibility.

- **Mobile App:** Built with React Native, Expo, and TypeScript ([moment-app](https://github.com/zeon-X/moment-app))
- **Backend API:** Node.js, Express, Prisma ORM ([moment-server](https://github.com/zeon-X/moment-server))

For detailed documentation, see [app/README.md](app/README.md) and [server/README.md](server/README.md).

---

## Android App

Download the latest Android APK:

[Download Android App](https://drive.google.com/file/d/1DeEwpxElQ5AtMLS_qUWuLluNR44_9xWA/view?usp=drive_link)

---

## Setup

1. **Clone the repository**

   ```sh
   git clone https://github.com/zeon-X/moment-mini-social-app.git
   cd moment-mini-social-media-app
   ```

2. **Install dependencies**
   - For the mobile app:
     ```sh
     cd app
     npm install
     # or
     yarn install
     ```
   - For the backend server:
     ```sh
     cd ../server
     npm install
     ```

3. **Configure environment**
   - See [app/README.md](app/README.md) and [server/README.md](server/README.md) for environment setup, Firebase config, and environment variables.

4. **Run the app**
   - Mobile app:
     ```sh
     cd app
     npx expo start
     ```
   - Backend server:
     ```sh
     cd server
     npm run dev
     ```

---

## Features

- User authentication (login, registration, onboarding)
- Community feed: browse, create, and interact with posts
- Real-time notifications (push notifications for Android)
- User profile management
- Responsive, themed UI
- Modular, reusable components
- RESTful API with JWT authentication
- Pagination, comments, likes
- OpenAPI documentation for backend

---

## Future Improvements

- Unit & integration tests
- CI/CD automation
- Enhanced error handling
- Offline support & caching
- Accessibility improvements
- Performance optimization
- Feature expansion (messaging, reactions, moderation, etc.)

---

## Repository Links

- [Frontend Mobile App](https://github.com/zeon-X/moment-app)
- [Backend API Server](https://github.com/zeon-X/moment-server)

---

## Screenshots

<p align="center">
  <img src="./assets/images/screenshot1.png" alt="Screenshot 1" width="30%"/>
  <img src="./assets/images/screenshot2.png" alt="Screenshot 2" width="30%"/>
  <img src="./assets/images/screenshot3.png" alt="Screenshot 3" width="30%"/>
</p>

---

For more details, see [app/README.md](app/README.md) and [server/README.md](server/README.md).
