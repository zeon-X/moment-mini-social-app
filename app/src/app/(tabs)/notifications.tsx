import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import LoadingText from "@/components/ui/loading-text";
import { NotificationCard } from "@/components/ui/notification-card";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "@/services/modules/notification.service";
import { Notification } from "@/types/notification";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { View } from "react-native";

const NotificationTabScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      handleRefresh();
    }, []),
  );

  const handleRefresh = async () => {
    setIsLoading(true);
    // TODO: Fetch new notifications from API
    await getUserNotifications().then((data) => {
      setNotifications(data.data);
    });
    setIsLoading(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationPress = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
  };

  return (
    <ScreenLayout
      title="Notifications"
      headerRight={
        unreadCount > 0 && (
          <View className="bg-orange-500 rounded-full px-3 py-1">
            <ThemedText type="xs" className="text-white font-semibold">
              {unreadCount}
            </ThemedText>
          </View>
        )
      }
      contentClassName="px-4 py-4 pb-8"
      onRefresh={handleRefresh}
    >
      {/* Notifications List */}
      {notifications.length === 0 && isLoading ? (
        <LoadingText message="Loading notifications..." />
      ) : notifications.length > 0 ? (
        notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onPress={() => handleNotificationPress(notification.id)}
          />
        ))
      ) : (
        <View className="items-center justify-center py-12">
          <ThemedText type="small" className="text-gray-500">
            No notifications yet
          </ThemedText>
        </View>
      )}
    </ScreenLayout>
  );
};

export default NotificationTabScreen;
