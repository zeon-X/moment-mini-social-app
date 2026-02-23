import { ThemedText } from "@/components/themed-text";
import React from "react";
import { View } from "react-native";

type StatCardProps = {
  value: number;
  label: string;
};

export function StatCard({ value, label }: StatCardProps) {
  return (
    <View className="flex-1 items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <ThemedText type="defaultSemiBold" className="text-xl">
        {value}
      </ThemedText>
      <ThemedText type="xs" className="text-gray-500 mt-1">
        {label}
      </ThemedText>
    </View>
  );
}
