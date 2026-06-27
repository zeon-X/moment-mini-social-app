import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import LoadingText from "@/components/ui/loading-text";
import { NotificationCard } from "@/components/ui/notification-card";
import { useNotifications } from "@/context/notification-context";
import { showErrorAlert } from "@/utils/error-handler";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, FlatList, RefreshControl, View } from "react-native";

const NotificationTabScreen = () => {
  const {
    notifications,
    loading,
    loadingMore,
    error,
    refreshNotifications,
    loadMoreNotifications,
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
      contentClassName="flex-1"
      scrollable={false}
      contentContainerProps={{ style: { flex: 1 } }}
    >
      <FlatList
        data={notifications}
        keyExtractor={(notification) => notification.id}
        contentContainerClassName="px-4 py-4 pb-8"
        refreshControl={
          <RefreshControl
            refreshing={loading && notifications.length > 0}
            onRefresh={refreshNotifications}
            tintColor="#f04c00df"
          />
        }
        ListEmptyComponent={
          loading ? (
            <LoadingText message="Loading notifications..." />
          ) : error ? (
            <View className="items-center justify-center py-12">
              <ThemedText type="small" className="text-red-500 text-center">
                {error}
              </ThemedText>
            </View>
          ) : (
            <View className="items-center justify-center py-12">
              <ThemedText type="small" className="text-gray-500">
                No notifications yet
              </ThemedText>
            </View>
          )
        }
        ListFooterComponent={
          loadingMore ? <ActivityIndicator color="#f04c00df" /> : null
        }
        renderItem={({ item: notification }) => (
          <NotificationCard
            notification={notification}
            onPress={() => handleNotificationPress(notification.id)}
          />
        )}
        onEndReached={loadMoreNotifications}
        onEndReachedThreshold={0.4}
      />
    </ScreenLayout>
  );
};

export default NotificationTabScreen;
