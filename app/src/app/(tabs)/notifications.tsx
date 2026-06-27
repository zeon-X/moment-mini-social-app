import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import LoadingText from "@/components/ui/loading-text";
import { NotificationCard } from "@/components/ui/notification-card";
import { useNotifications } from "@/context/notification-context";
import { showErrorAlert } from "@/utils/error-handler";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { View } from "react-native";

const NotificationTabScreen = () => {
  const {
    notifications,
    loading,
    error,
    refreshNotifications,
    markAsRead,
  } = useNotifications();
  const lastAlertedErrorRef = useRef<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      refreshNotifications();
    }, [refreshNotifications]),
  );

  useEffect(() => {
    if (!error || lastAlertedErrorRef.current === error) return;

    lastAlertedErrorRef.current = error;
    showErrorAlert(error, undefined, "Notifications");
  }, [error]);

  const handleNotificationPress = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      showErrorAlert(error, "Unable to mark notification as read.");
    }
  };

  return (
    <ScreenLayout
      title="Notifications"
      // headerRight={
      //   unreadCount > 0 && (
      //     <View className="bg-orange-500 rounded-full px-3 py-1">
      //       <ThemedText type="xs" className="text-white font-semibold">
      //         {unreadCount}
      //       </ThemedText>
      //     </View>
      //   )
      // }
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
