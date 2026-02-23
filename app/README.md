# Moment App

## Overview

Moment App is a modern, cross-platform social media application built with React Native and Expo. It provides a seamless user experience for authentication, social media engagement, post creation, notifications, and user profile management. The app leverages modular architecture, reusable components, and best practices for scalability and maintainability.

## Features

- **User Authentication**: Secure login, registration, and onboarding flows.
- **Community Feed**: Browse, create, and interact with posts in a social media-driven environment.
- **Notifications**: Real-time notifications for user engagement and updates.
- **Profile Management**: View profiles.
- **Responsive UI**: Themed components and layouts for a consistent look and feel.
- **Reusable Components**: Modular UI elements for rapid development.
- **TypeScript Support**: Strong typing for improved reliability and developer experience.

## Setup

1. **Clone the repository**

   ```sh
   git clone https://github.com/zeon-X/moment-app
   cd moment-app
   ```

2. **Install dependencies**

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Configure environment**
   - Ensure `google-services.json` and `GoogleService-Info.plist` are present for Firebase integration.
   - Update any environment variables as needed.

4. **Run the app**

   ```sh
   npx expo start
   ```

   - Use the **Expo Dev Client** app to preview the application.
     Download the APK here:  
     👉 [Download Development Build](https://drive.google.com/file/d/187h3yniaCreQmYZwTwsw0GEg4cD1CVgZ/view?usp=drive_link)

## Folder Structure

```
├── assets/                # Images and static assets
├── scripts/               # Utility scripts (e.g., project reset)
├── src/
│   ├── app/               # App entry, layouts, and screens
│   │   ├── (auth)/        # Auth-related screens (login, register, onboarding)
│   │   ├── (tabs)/        # Main tab screens (social media, create post, notifications, profile)
│   │   ├── _layout.tsx    # Root layout
│   │   ├── global.css     # Global styles
│   │   └── splash.tsx     # Splash screen
│   ├── components/        # Reusable UI components
│   │   └── ui/            # Atomic UI elements (buttons, cards, etc.)
│   ├── config/            # App configuration
│   ├── constants/         # Theme and constant values
│   ├── context/           # React context providers (e.g., auth)
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API and business logic services
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions and validation
├── app.config.js          # Expo app configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── ...                    # Other configuration and project files
```

## Future Improvements

- **Unit & Integration Tests**: Add comprehensive test coverage for components and services.
- **CI/CD Integration**: Automate builds, tests, and deployments.
- **Enhanced Error Handling**: Improve user feedback and error reporting.
- **Offline Support**: Enable offline capabilities and data caching.
- **Accessibility**: Ensure full accessibility compliance.
- **Performance Optimization**: Further optimize for speed and resource usage.
- **Feature Expansion**: Add more social media features, such as messaging, reactions, and advanced moderation tools.

---

For questions or contributions, please open an issue or submit a pull request.
