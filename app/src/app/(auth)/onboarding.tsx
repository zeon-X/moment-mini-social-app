import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import React from "react";
import { Image, useWindowDimensions, View } from "react-native";

const Onboarding = () => {
  const router = useRouter();
  const { height } = useWindowDimensions();
  return (
    <ThemedView className="flex-1 ">
      {/* Cover Image */}
      <Image
        source={require("@assets/images/onboarding-cover.png")}
        style={{
          width: "100%",
          height: height * 0.5,
          resizeMode: "cover",
          marginBottom: 24,
          borderRadius: 24,
        }}
      />
      <View className="flex-1 items-center justify-between px-6 pb-10">
        <View className="justify-center items-center gap-4">
          {/* Logo */}
          <Image
            source={require("@assets/images/text-logo.png")}
            style={{
              width: 180,
              height: 40,
              resizeMode: "contain",
            }}
            accessibilityLabel="Moment logo"
          />
          {/* Subtitle */}
          <ThemedText className="">
            Share every moments with your friends
          </ThemedText>
        </View>

        {/* Buttons */}
        <View className="w-full mt-2">
          <Button
            title="Register"
            variant="primary"
            className="mb-4"
            onPress={() => router.push("/(auth)/register")}
          />
          <Button
            title="Login"
            variant="secondary"
            onPress={() => router.push("/(auth)/login")}
          />
        </View>
        {/* Extra: Divider and tagline */}
        <View className="w-full items-center mt-8">
          <View className="w-1/2 h-0.5 bg-gray-200 mb-2" />
          <ThemedText style={{ fontSize: 12 }}>
            Connect. Share. Celebrate.
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
};

export default Onboarding;
