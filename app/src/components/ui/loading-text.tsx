import React from "react";
import { View } from "react-native";
import { ThemedText } from "../themed-text";

const LoadingText = ({ message }: { message: string | null }) => {
  return (
    <View className="flex-1 justify-center items-center">
      <ThemedText className="text-gray-500 mb-4">{message}</ThemedText>
    </View>
  );
};

export default LoadingText;
