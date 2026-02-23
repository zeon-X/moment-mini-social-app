import React, { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { IconSymbol } from "./icon-symbol";

type FormTextInputProps = TextInputProps & {
  label?: string;
  error?: string;
  success?: string;
  className?: string;
  isLoading?: boolean;

  lightColor?: string;
  darkColor?: string;
};

export function FormTextInput({
  label,
  isLoading,
  error,
  success,
  lightColor,
  darkColor,
  className = "",
  ...props
}: FormTextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = props.secureTextEntry !== undefined;

  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <ThemedView className="gap-1">
      {label ? (
        <ThemedText type="small" className="text-[12px] font-medium">
          {label}
        </ThemedText>
      ) : null}
      <View style={{ position: "relative" }}>
        <TextInput
          {...props}
          secureTextEntry={
            isPasswordField ? !showPassword : props.secureTextEntry
          }
          className={`bg-gray-100 dark:bg-gray-800 rounded-md px-4 py-4 ${className}`.trim()}
          style={{ color }}
        />

        {isLoading && (
          <View
            style={{
              position: "absolute",
              right: 16,
              top: 0,
              height: "100%",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="small" color="#888" />
          </View>
        )}

        {isPasswordField && (
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 16,
              top: 0,
              height: "100%",
              justifyContent: "center",
            }}
            onPress={() => setShowPassword((prev) => !prev)}
            accessibilityLabel={
              showPassword ? "Hide password" : "Show password"
            }
          >
            <IconSymbol
              name={showPassword ? "eye.slash" : "eye"}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500">{error}</Text>}
      {success && <Text className="text-green-500">{success}</Text>}
    </ThemedView>
  );
}
