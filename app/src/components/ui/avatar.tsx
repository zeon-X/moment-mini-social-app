import React from "react";
import { Text, View } from "react-native";

type AvatarSize = "sm" | "md" | "lg";
type AvatarProps = {
  name: string;
  size?: AvatarSize;
  color?: string;
};

const sizeClasses: Record<AvatarSize, { container: string; text: string }> = {
  sm: {
    container: "w-10 h-10",
    text: "text-sm",
  },
  md: {
    container: "w-12 h-12",
    text: "text-base",
  },
  lg: {
    container: "w-16 h-16",
    text: "text-2xl",
  },
};

const defaultColors = [
  "#FF6B6B",
  "#4ECDC4",
  "#95E1D3",
  "#F38181",
  "#AA96DA",
  "#FCBAD3",
  "#A8D8EA",
  "#FFD3B6",
  "#FF9999",
  "#B4E7FF",
];

/**
 * Generates a consistent color based on the name
 */
function getColorFromName(name: string): string {
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return defaultColors[hash % defaultColors.length];
}

/**
 * Reusable Avatar component
 * @param name - User's name (required, used to generate initials and color)
 * @param size - Avatar size: 'sm' (40x40), 'md' (48x48), 'lg' (64x64). Default: 'md'
 * @param color - Custom color. If not provided, generates color from name
 */
export function Avatar({ name, size = "md", color }: AvatarProps) {
  const sizes = sizeClasses[size];
  const backgroundColor = color || getColorFromName(name);
  const initials = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <View
      className={`${sizes.container} rounded-full justify-center items-center`}
      style={{ backgroundColor }}
    >
      <Text className={`${sizes.text} text-white font-bold`}>{initials}</Text>
    </View>
  );
}
