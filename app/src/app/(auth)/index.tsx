import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, useWindowDimensions } from "react-native";

const SplashScreen = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Zoom in/out loop animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Navigate after 2.5 seconds
    const timeout = setTimeout(() => {
      router.replace("/(auth)/onboarding");
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <ThemedView className="flex-1 items-center justify-center">
      <Animated.Image
        source={require("@assets/images/text-logo.png")}
        style={{
          width: width * 0.5,
          height: 60,
          marginBottom: 6,
          transform: [{ scale: scaleAnim }],
        }}
        resizeMode="contain"
      />
    </ThemedView>
  );
};

export default SplashScreen;
