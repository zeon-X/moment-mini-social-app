import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { Avatar } from "./avatar";

export type CommunityMember = {
  id: string;
  name: string;
  username: string;
  age: number;
  posts: number;
};

type MemberCardProps = {
  member: CommunityMember;
  onPress?: () => void;
};

export function MemberCard({ member, onPress }: MemberCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView className="flex-row items-center gap-4 p-4 mb-3 rounded-lg bg-gray-50 dark:bg-gray-800">
        {/* Avatar */}
        <Avatar name={member.name} size="md" />

        {/* Info */}
        <View className="flex-1">
          <ThemedText type="defaultSemiBold">{member.name}</ThemedText>
          <ThemedText type="small" className="text-gray-500">
            @{member.username}
          </ThemedText>
          <View className="flex-row gap-3 mt-1">
            <ThemedText type="xs" className="text-gray-500">
              {member.age} years
            </ThemedText>
            <ThemedText type="xs" className="text-gray-500">
              {member.posts} post{member.posts !== 1 ? "s" : ""}
            </ThemedText>
          </View>
        </View>

        {/* Action Button */}
        {/* <TouchableOpacity className="bg-orange-500 px-4 py-2 rounded-lg">
          <Text className="text-white  text-sm font-semibold">View</Text>
        </TouchableOpacity> */}
      </ThemedView>
    </TouchableOpacity>
  );
}
