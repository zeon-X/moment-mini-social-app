import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { createPost } from "@/services/modules/post.service";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";

const MAX_CHAR_COUNT = 280;

const CreatePostTabScreen = () => {
  const { userInfo } = useAuth();
  const router = useRouter();
  const [postText, setPostText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleRefresh = async () => {
    // TODO: Refresh post form data if needed
  };

  const handlePost = async () => {
    if (postText.trim().length === 0) return;

    setIsPosting(true);
    // Simulate API call

    await createPost({ content: postText }).then((data) => {
      if (data.success) {
        // Post created successfully
        // You can add the new post to a global state or trigger a refresh of the feed

        setPostText("");
        setIsPosting(false);
        router.push("/"); // Navigate to the desired screen after posting
      } else {
        setIsPosting(false);
        // Handle error case
        // You can show an error toast or alert here
      }
    });
  };

  const charCount = postText.length;
  const isNearLimit = charCount > MAX_CHAR_COUNT * 0.8;
  const isOverLimit = charCount > MAX_CHAR_COUNT;
  const canPost = postText.trim().length > 0 && !isOverLimit;

  return (
    <ScreenLayout
      title="Create Post"
      scrollViewClassName="flex-1"
      contentClassName="flex-1 px-4 py-6"
      onRefresh={handleRefresh}
    >
      {/* User Info Section */}
      <View className="flex-row items-center gap-3 pb-6 ">
        <Avatar name={userInfo?.name || ""} size="md" />
        <View className="flex-1">
          <ThemedText type="defaultSemiBold">{userInfo?.name}</ThemedText>
          <ThemedText type="small">@{userInfo?.username}</ThemedText>
        </View>
      </View>

      {/* Text Input */}
      <View className="mb-6">
        <TextInput
          placeholder="What's on your mind?"
          placeholderTextColor="#999"
          multiline
          numberOfLines={10}
          value={postText}
          onChangeText={setPostText}
          maxLength={MAX_CHAR_COUNT}
          className="bg-gray-100 dark:bg-gray-800 text-base text-gray-900 dark:text-white p-4 rounded-lg min-h-48"
          textAlignVertical="top"
        />

        {/* Character Counter */}
        <View className="flex-row justify-end items-center mt-3">
          <Text
            className={`text-sm font-medium ${
              isOverLimit
                ? "text-red-500"
                : isNearLimit
                  ? "text-orange-500"
                  : "text-gray-500"
            }`}
          >
            {charCount} / {MAX_CHAR_COUNT}
          </Text>
          {isOverLimit && (
            <Text className="text-xs text-red-500">
              Character limit exceeded
            </Text>
          )}
        </View>
      </View>

      {/* Post Button */}
      <View className="">
        <Button
          title={isPosting ? "Posting..." : "Post"}
          variant={canPost ? "primary" : "secondary"}
          onPress={handlePost}
          disabled={!canPost || isPosting}
        />
      </View>

      {/* Info Text */}
      <ThemedText type="small" className="text-center text-gray-500 mt-6">
        Your post will be visible to your community
      </ThemedText>
    </ScreenLayout>
  );
};

export default CreatePostTabScreen;
