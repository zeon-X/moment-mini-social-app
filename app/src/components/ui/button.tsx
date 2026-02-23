import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline";

type ButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: ButtonVariant;
  className?: string;
  textClassName?: string;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
};

const variantStyles: Record<
  ButtonVariant,
  { container: string; text: string }
> = {
  primary: {
    container: "bg-orange-600",
    text: "text-white",
  },
  secondary: {
    container: "bg-gray-200",
    text: "text-gray-700",
  },
  outline: {
    container: "bg-transparent border border-orange-600",
    text: "text-orange-600",
  },
};

export function Button({
  title,
  variant = "primary",
  className = "",
  textClassName = "",
  disabled,
  isLoading,
  loadingText,
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant];

  return (
    <TouchableOpacity
      {...props}
      disabled={disabled || isLoading}
      activeOpacity={0.85}
      className={`${styles.container} w-full py-4 rounded-xl ${disabled ? "opacity-60" : ""} ${className}`.trim()}
    >
      <Text
        className={`${styles.text} text-center text-lg font-semibold tracking-wide ${textClassName}`.trim()}
      >
        {isLoading ? loadingText || title : title}
      </Text>
    </TouchableOpacity>
  );
}
