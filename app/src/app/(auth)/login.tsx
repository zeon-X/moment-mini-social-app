import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import { Button } from "../../components/ui/button";
import { FormTextInput } from "../../components/ui/form-text-input";

import { useLogin } from "@/hooks/auth/useLogin";

const Login = () => {
  const { router, formData, errors, handleChange, isLoggingIn, handleLogin } =
    useLogin();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ThemedView className="flex-1 justify-center items-center px-6">
        <Image
          source={require("@assets/images/icon-logo.png")}
          style={{ width: 64, height: 64, marginBottom: 6 }}
          resizeMode="contain"
        />
        <ThemedText type="title" style={{ marginBottom: 16 }}>
          Welcome Back
        </ThemedText>

        <View className="w-full max-w-md gap-4">
          <FormTextInput
            label="Email or Username"
            placeholder="Email or Username"
            value={formData.identifier}
            onChangeText={(v) => handleChange("identifier", v)}
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.identifier}
          />

          <FormTextInput
            label="Password"
            placeholder="Password"
            value={formData.password}
            onChangeText={(v) => handleChange("password", v)}
            secureTextEntry
            error={errors.password}
          />

          <Button
            title="Login"
            variant="primary"
            className="mt-2 rounded-md py-3"
            onPress={handleLogin}
            isLoading={isLoggingIn}
            loadingText="Logging in..."
          />

          {errors.message && (
            <Text className="text-red-500 text-center mb-2 font-medium">
              {errors.message}
            </Text>
          )}

          <View className="flex-row justify-center items-center gap-1 mt-1">
            <ThemedText type="small">Don’t have an account?</ThemedText>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <ThemedText
                type="small"
                className="font-semibold text-orange-600"
              >
                Register
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

export default Login;
