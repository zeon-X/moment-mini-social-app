import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import LoadingText from "@/components/ui/loading-text";
import { NotificationCard } from "@/components/ui/notification-card";
import { useNotifications } from "@/context/notification-context";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";

const NotificationTabScreen = () => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    refreshNotifications,
    markAsRead,
  } = useNotifications();

  useFocusEffect(
    React.useCallback(() => {
      refreshNotifications();
    }, [refreshNotifications]),
  );

  const handleNotificationPress = async (notificationId: string) => {
    await markAsRead(notificationId);
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
      onRefresh={refreshNotifications}
    >
      {/* Notifications List */}
      {notifications.length === 0 && loading ? (
        <LoadingText message="Loading notifications..." />
      ) : error ? (
        <View className="items-center justify-center py-12">
          <ThemedText type="small" className="text-red-500 text-center">
            {error}
          </ThemedText>
        </View>
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
