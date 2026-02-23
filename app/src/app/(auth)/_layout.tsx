import { ThemedView } from "@/components/themed-view";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const AuthLayout = () => {
  return (
    <ThemedView className="flex-1">
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </ThemedView>
  );
};

export default AuthLayout;
