import { ThemedScrollView } from "@/components/themed-scrollview";
import { ThemedText } from "@/components/themed-text";
import React, { ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenLayoutProps = {
  title: string;
  subtitle?: string | ReactNode;
  headerRight?: ReactNode;
  children: ReactNode;
  scrollViewClassName?: string;
  contentClassName?: string;
  onRefresh?: () => Promise<void> | void;
};

export function ScreenLayout({
  title,
  subtitle,
  headerRight,
  children,
  scrollViewClassName = "flex-1",
  contentClassName = "px-4 py-4",
  onRefresh,
}: ScreenLayoutProps) {
  const hasHeaderRight = !!headerRight;
  const hasSubtitle = !!subtitle;

  return (
    <SafeAreaView
      edges={{ bottom: "off", top: "additive" }}
      style={{ flex: 1 }}
    >
      {/* Fixed Header Section */}
      <View className="px-4 py-4 flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700">
        {/* Left Side - Title */}
        <View className={hasHeaderRight ? "flex-1" : ""}>
          <ThemedText type="title" className="text-2xl">
            {title}
          </ThemedText>
        </View>

        {/* Right Side */}
        {headerRight && <View>{headerRight}</View>}
      </View>

      {/* Scrollable Content Area */}
      <ThemedScrollView className={scrollViewClassName} onRefresh={onRefresh}>
        {/* Subtitle (if exists) */}
        {hasSubtitle && (
          <View className="px-4 py-4 border-b border-gray-100 dark:border-gray-700">
            {typeof subtitle === "string" ? (
              <ThemedText type="small" className="text-gray-500">
                {subtitle}
              </ThemedText>
            ) : (
              subtitle
            )}
          </View>
        )}

        {/* Main Content Area */}
        <View className={contentClassName}>{children}</View>
      </ThemedScrollView>
    </SafeAreaView>
  );
}
