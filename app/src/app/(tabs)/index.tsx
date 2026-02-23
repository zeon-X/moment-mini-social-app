import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { type Comment } from "@/components/ui/comments-list";
import LoadingText from "@/components/ui/loading-text";
import { PostCard, type Post } from "@/components/ui/post-card";
import {
  commentOnPost,
  getFeed,
  toggleLikeOnPost,
} from "@/services/modules/post.service";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput } from "react-native";

export default function HomeTabScreen() {
  const [filterText, setFilterText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      handleRefresh();
    }, []),
  );

  const handleRefresh = async () => {
    setIsLoading(true);
    // TODO: Fetch fresh posts from API
    await getFeed().then((data) => {
      if (data.success) {
        setPosts(data.data);
      }
    });
    setIsLoading(false);
  };

  const filteredPosts = posts?.filter((post) =>
    filterText.trim() === ""
      ? true
      : post.username.toLowerCase().includes(filterText.toLowerCase()) ||
        post.author.toLowerCase().includes(filterText.toLowerCase()),
  );

  const handleLike = async (postId: string) => {
    await toggleLikeOnPost(postId);

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      }),
    );
  };

  const handleAddComment = async (postId: string, comment: Comment) => {
    await commentOnPost(postId, { content: comment.content.trim() });

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              { ...comment, content: comment.content.trim() },
            ],
          };
        }
        return post;
      }),
    );
  };

  const handleToggleComments = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  return (
    <ScreenLayout
      title="Feed"
      scrollViewClassName="flex-1"
      contentClassName="px-4 py-4"
      onRefresh={handleRefresh}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <>
          {/* Filter Input */}
          <TextInput
            placeholder="Filter by username or name..."
            placeholderTextColor="#999"
            value={filterText}
            onChangeText={setFilterText}
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-lg mb-6 border border-gray-200 dark:border-gray-700"
          />

          {/* Posts List */}
          {posts.length === 0 && isLoading ? (
            <LoadingText message="Loading feed..." />
          ) : filteredPosts?.length > 0 ? (
            filteredPosts?.map((post) => (
              <PostCard
                key={post?.id}
                post={post}
                isExpanded={expandedPostId === post?.id}
                onLike={handleLike}
                onToggleComments={handleToggleComments}
                onAddComment={handleAddComment}
              />
            ))
          ) : (
            <ThemedView className="flex-1 items-center justify-center py-12">
              <ThemedText className="text-gray-500 text-center">
                {filterText.trim() !== "" &&
                  `No posts found for "${filterText}"`}
              </ThemedText>
            </ThemedView>
          )}

          {/* Empty State */}
          {!isLoading && filteredPosts?.length === 0 && !filterText && (
            <ThemedView className="flex-1 items-center justify-center py-12">
              <ThemedText className="text-gray-500 text-center">
                No posts yet. Pull down to refresh or check back later!
              </ThemedText>
            </ThemedView>
          )}
        </>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}
