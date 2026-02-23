import { useState } from "react";
import { RefreshControl, ScrollView, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedScrollViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  onRefresh?: () => Promise<void> | void;
};

export function ThemedScrollView({
  style,
  lightColor,
  darkColor,
  onRefresh,
  ...otherProps
}: ThemedScrollViewProps) {
  const [refreshing, setRefreshing] = useState(false);
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      } else {
        // Default refresh operation
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#f04c00df"
        />
      }
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}
