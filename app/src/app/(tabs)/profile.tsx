import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Avatar } from "@/components/ui/avatar";
import { CrossConfirm } from "@/components/ui/cross-confirm";
import LoadingText from "@/components/ui/loading-text";
import { PostCard } from "@/components/ui/post-card";
import { StatCard } from "@/components/ui/stat-card";
import {
  commentOnPost,
  toggleLikeOnPost,
} from "@/services/modules/post.service";
import { getUserDetails } from "@/services/modules/user.service";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/auth-context";
import type { Comment, UserProfile } from "../../types/user";

const SAMPLE_USER: UserProfile = {
  name: "",
  age: 0,
  email: "",
  username: "",
  stats: { posts: 0, comments: 0, likes: 0 },
  posts: [],
};

const ProfileTabScreen = () => {
  const { clearSession, userInfo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserProfile>(SAMPLE_USER);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      handleRefresh();
    }, []),
  );

  const handleRefresh = async () => {
    setIsLoading(true);
    // TODO: Fetch user data from API

    await getUserDetails(userInfo?.username || "").then((data) => {
      if (data.success) {
        setUser(data.data);
      }
    });
    setIsLoading(false);
  };

  const handleLogout = async () => {
    const confirmed = await CrossConfirm({
      title: "Logout",
      message: "Are you sure you want to logout?",
      confirmText: "Logout",
      cancelText: "Cancel",
      destructive: true,
    });
    if (confirmed) {
      setIsLoggingOut(true);
      await clearSession();
      // Simulate logout
      setTimeout(() => {
        setIsLoggingOut(false);
        // In a real app, this would navigate to auth screen
        console.log("Logged out");
      }, 500);
    }
  };

  const handleLike = async (postId: string) => {
    await toggleLikeOnPost(postId);

    setUser((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        likes:
          prev.stats?.likes +
          (user?.posts.find((p) => p.id === postId)?.liked ? -1 : 1),
      },
      posts: prev.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    }));
  };

  const handleAddComment = async (postId: string, comment: Comment) => {
    await commentOnPost(postId, { content: comment.content.trim() });
    setUser((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        comments: prev.stats?.comments + 1,
      },
      posts: prev.posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post,
      ),
    }));
  };

  const handleToggleComments = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  return (
    <ScreenLayout
      title="Profile"
      headerRight={
        <TouchableOpacity
          onPress={handleLogout}
          disabled={isLoggingOut}
          className="bg-orange-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white text-sm font-semibold">
            {isLoggingOut ? "..." : "Logout"}
          </Text>
        </TouchableOpacity>
      }
      contentClassName="px-4 py-6"
      scrollViewClassName="flex-1"
      onRefresh={handleRefresh}
    >
      {user === SAMPLE_USER && isLoading ? (
        <LoadingText message="Loading profile..." />
      ) : (
        <>
          {/* Avatar */}
          <View className="items-center mb-4">
            <Avatar name={user?.name} size="lg" />
          </View>

          {/* Info */}
          <View className="items-center mb-4">
            {/* Name */}
            <ThemedText type="defaultSemiBold" className="text-xl mb-1">
              {user?.name}
            </ThemedText>
            {/* Username & Email */}
            <ThemedText type="small" className="text-gray-500">
              @{user?.username} {user?.email && "|"} {user?.email}
            </ThemedText>
          </View>

          {/* Stats Section */}
          <View className="flex-row gap-3 mb-8">
            <StatCard value={user?.stats?.posts} label="Posts" />
            <StatCard value={user?.stats?.comments} label="Comments" />
            <StatCard value={user?.stats?.likes} label="Likes" />
          </View>

          {/* My Posts Section */}
          <View className="mb-6">
            <ThemedText type="defaultSemiBold" className="text-lg mb-4">
              My Posts
            </ThemedText>
            {user?.posts?.length > 0 ? (
              user?.posts?.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isExpanded={expandedPostId === post.id}
                  onLike={handleLike}
                  onToggleComments={handleToggleComments}
                  onAddComment={handleAddComment}
                />
              ))
            ) : (
              <ThemedText
                type="small"
                className="text-gray-500 text-center py-4"
              >
                No posts yet
              </ThemedText>
            )}
          </View>
        </>
      )}
    </ScreenLayout>
  );
};

export default ProfileTabScreen;
