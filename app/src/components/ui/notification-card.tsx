import moment from "moment";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import type { Notification } from "../../types/notification";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { Avatar } from "./avatar";
import { IconSymbol } from "./icon-symbol";

type NotificationCardProps = {
  notification: Notification;
  onPress?: () => void;
};

export function NotificationCard({
  notification,
  onPress,
}: NotificationCardProps) {
  const getIcon = () => {
    return notification.type === "like"
      ? { name: "heart.fill" as const, color: "#FF6B6B" }
      : { name: "bubble.right.fill" as const, color: "#f04c00df" };
  };

  const getMessage = () => {
    if (notification.type === "like") {
      return `${notification.user.name} liked your post`;
    }
    return `${notification.user.name} commented on your post`;
  };

  const icon = getIcon();

  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView
        className={`flex-row items-center gap-4 p-4 mb-3 rounded-lg ${
          notification.read
            ? "bg-gray-50 dark:bg-gray-800"
            : "bg-orange-50 dark:bg-gray-750"
        }`}
      >
        {/* Avatar */}
        <View className="relative">
          <Avatar name={notification.user.name} size="md" />
          <View className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1">
            <IconSymbol size={14} name={icon.name} color={icon.color} />
          </View>
        </View>

        {/* Content */}
        <View className="flex-1">
          <ThemedText type="defaultSemiBold">{getMessage()}</ThemedText>
          <ThemedText
            type="small"
            className="text-gray-500 mt-1 line-clamp-2"
            numberOfLines={2}
          >
            {`"${notification.postPreview}"`}
          </ThemedText>
          <ThemedText type="xs" className="text-gray-400 mt-1">
            {moment(notification.timestamp).fromNow()}
          </ThemedText>
        </View>

        {/* Unread indicator */}
        {!notification.read && (
          <View className="w-2 h-2 rounded-full bg-orange-500" />
        )}
      </ThemedView>
    </TouchableOpacity>
  );
}
