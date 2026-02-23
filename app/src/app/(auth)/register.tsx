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

import { useRegister } from "@/hooks/auth/useRegister";

const Register = () => {
  const {
    router,
    formData,
    isUsernameAvailable,
    isUsernameChecking,
    errors,
    handleChange,
    isRegistering,
    handleRegister,
  } = useRegister();

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
          Create Account
        </ThemedText>
        <View className="w-full max-w-md gap-4">
          <FormTextInput
            label="Choose Username"
            placeholder="Username"
            value={formData.username}
            onChangeText={(v) => handleChange("username", v)}
            autoCapitalize="none"
            isLoading={isUsernameChecking}
            error={errors.username}
            success={
              !isUsernameChecking && isUsernameAvailable
                ? "This username is available!"
                : undefined
            }
          />

          <FormTextInput
            label="Name"
            placeholder="Name"
            value={formData.name}
            onChangeText={(v) => handleChange("name", v)}
            autoCapitalize="words"
            error={errors.name}
          />
          <FormTextInput
            label="Age"
            placeholder="Age"
            value={formData.age}
            onChangeText={(v) => handleChange("age", v)}
            keyboardType="numeric"
            error={errors.age}
          />
          <FormTextInput
            label="Email"
            placeholder="Email"
            value={formData.email}
            onChangeText={(v) => handleChange("email", v)}
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.email}
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
            title="Register"
            variant="primary"
            className="mt-2 rounded-md py-3"
            onPress={handleRegister}
            isLoading={isRegistering}
            loadingText="Registering..."
          />

          {errors.message && (
            <Text className="text-red-500 text-center mb-2 font-medium">
              {errors.message}
            </Text>
          )}

          <View className="flex-row justify-center items-center gap-1 mt-1">
            <ThemedText type="small">Already have an account?</ThemedText>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <ThemedText
                type="small"
                className="font-semibold text-orange-600"
              >
                Go Login
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

export default Register;
