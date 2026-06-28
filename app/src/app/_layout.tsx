import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "nativewind";
import "react-native-reanimated";
import "./global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useCallback, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../context/auth-context";
import { NotificationProvider } from "../context/notification-context";
import SplashScreenController from "./splash";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NOTIFICATIONS_ROUTE = "/(tabs)/notifications";

const RootLayout = () => {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (Platform.OS !== "android") return;

    Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#f04c00",
    }).catch(() => {
      // Channels are Android-only; failures should not block app startup.
    });
  }, []);

  return (
    <AuthProvider>
      <NotificationProvider>
        <SafeAreaProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <NotificationBootstrap />
            <StatusBar style="auto" />
            <RootNavigator />
          </ThemeProvider>
        </SafeAreaProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default RootLayout;

const NotificationBootstrap = () => {
  const { loading, isAuthenticated } = useAuth();
  const pendingNotificationTapRef = useRef(false);

  const openNotificationsFromPush = useCallback(() => {
    if (loading || !isAuthenticated) {
      pendingNotificationTapRef.current = true;
      return;
    }

    router.push(NOTIFICATIONS_ROUTE);
  }, [isAuthenticated, loading]);

  useEffect(() => {
    const receivedSubscription =
      Notifications.addNotificationReceivedListener(() => {
        Notifications.setBadgeCountAsync(0).catch(() => {});
      });
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(() => {
        openNotificationsFromPush();
      });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [openNotificationsFromPush]);

  useEffect(() => {
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;

      openNotificationsFromPush();
    });
  }, [openNotificationsFromPush]);

  useEffect(() => {
    Notifications.setBadgeCountAsync(0).catch(() => {
      // Badge support varies by platform/device.
    });
  }, []);

  useEffect(() => {
    if (loading || !isAuthenticated || !pendingNotificationTapRef.current) {
      return;
    }

    pendingNotificationTapRef.current = false;
    router.push(NOTIFICATIONS_ROUTE);
  }, [isAuthenticated, loading]);

  return null;
};

const RootNavigator = () => {
  const { loading, isAuthenticated } = useAuth();
  return (
    <>
      <SplashScreenController isLoading={loading} />
      {
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen name="(tabs)" />
          </Stack.Protected>
          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
        </Stack>
      }
    </>
  );
};
