// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps, SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import {
  OpaqueColorValue,
  View,
  type StyleProp,
  type TextStyle,
} from "react-native";
import { ThemedText } from "../themed-text";

type IconMapping = Record<
  SymbolViewProps["name"],
  ComponentProps<typeof MaterialIcons>["name"]
>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "person.fill": "person",
  "person.2.fill": "people",
  "bell.fill": "notifications",
  "bell.badge.fill": "notifications-active",
  "plus.circle.fill": "add-circle",
  "heart.fill": "favorite",
  "bubble.right.fill": "chat",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  eye: "visibility",
  "eye.slash": "visibility-off",
} as const satisfies Partial<IconMapping>;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  count = 0,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
  count?: number;
}) {
  if (count > 0)
    return (
      <View className="relative">
        <MaterialIcons
          color={color}
          size={size}
          name={MAPPING[name]}
          style={style}
        />
        {/* Notification badge */}
        <View
          className="absolute top-[-2px] right-[-4px] bg-red-500 rounded-full px-1 min-w-[16px] h-[16px] items-center justify-center"
          style={{ zIndex: 1 }}
        >
          <ThemedText type="xs" className="text-white font-bold">
            {count}
          </ThemedText>
        </View>
      </View>
    );
  else
    return (
      <MaterialIcons
        color={color}
        size={size}
        name={MAPPING[name]}
        style={style}
      />
    );
}
