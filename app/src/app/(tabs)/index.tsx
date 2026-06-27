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
import { showErrorAlert } from "@/utils/error-handler";
import { useDebounce } from "@/utils/useDebounce";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  TextInput,
} from "react-native";

const PAGE_LIMIT = 10;

type Pagination = {
  page: number;
  limit: number;
  itemCount: number;
  hasMore: boolean;
  nextPage: number | null;
};

export default function HomeTabScreen() {
  const [filterText, setFilterText] = useState("");
  const debouncedFilterText = useDebounce(filterText, 500);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const paginationRef = useRef<Pagination | null>(null);
  const isLoadingMoreRef = useRef(false);

  const loadPosts = useCallback(
    async (page = 1, shouldRefresh = false) => {
      if (
        page > 1 &&
        (isLoadingMoreRef.current || !paginationRef.current?.hasMore)
      )
        return;

      if (page === 1) {
        if (shouldRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
      } else {
        isLoadingMoreRef.current = true;
        setIsLoadingMore(true);
      }

      try {
        const data = await getFeed({
          page,
          limit: PAGE_LIMIT,
          search: debouncedFilterText.trim() || undefined,
        });

        if (data.success) {
          setPosts((prev) =>
            page === 1 ? data.data : [...prev, ...data.data],
          );
          const nextPagination = data.pagination ?? null;
          paginationRef.current = nextPagination;
          setPagination(nextPagination);
        } else {
          showErrorAlert(data.message, "Unable to load feed.");
        }
      } catch (error) {
        showErrorAlert(error, "Unable to load feed.");
      } finally {
        if (page === 1) {
          setIsLoading(false);
          setIsRefreshing(false);
        } else {
          isLoadingMoreRef.current = false;
          setIsLoadingMore(false);
        }
      }
    },
    [debouncedFilterText],
  );

  const handleRefresh = useCallback(async () => {
    await loadPosts(1, posts.length > 0);
  }, [loadPosts, posts.length]);

  const handleLoadMore = useCallback(() => {
    if (pagination?.hasMore && pagination.nextPage && !isLoadingMore) {
      loadPosts(pagination.nextPage);
    }
  }, [isLoadingMore, loadPosts, pagination?.hasMore, pagination?.nextPage]);

  useFocusEffect(
    React.useCallback(() => {
      loadPosts(1);
    }, [loadPosts]),
  );

  useEffect(() => {
    setExpandedPostId(null);
  }, [debouncedFilterText]);

  const handleLike = async (postId: string) => {
    try {
      const data = await toggleLikeOnPost(postId);

      if (!data.success) {
        showErrorAlert(data.message, "Unable to update like.");
        return;
      }

      setPosts((prev) =>
        prev.map((post) => {
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
    } catch (error) {
      showErrorAlert(error, "Unable to update like.");
    }
  };

  const handleAddComment = async (postId: string, comment: Comment) => {
    try {
      const data = await commentOnPost(postId, {
        content: comment.content.trim(),
      });

      if (!data.success) {
        showErrorAlert(data.message, "Unable to add comment.");
        return;
      }

      setPosts((prev) =>
        prev.map((post) => {
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
    } catch (error) {
      showErrorAlert(error, "Unable to add comment.");
    }
  };

  const handleToggleComments = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  return (
    <ScreenLayout
      title="Feed"
      scrollViewClassName="flex-1"
      contentClassName="flex-1"
      scrollable={false}
      contentContainerProps={{ style: { flex: 1 } }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <FlatList
          data={posts}
          keyExtractor={(post) => post.id}
          contentContainerClassName="px-4 py-4 pb-8 "
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#f04c00df"
            />
          }
          ListHeaderComponent={
            <TextInput
              placeholder="Search by username or name..."
              placeholderTextColor="#999"
              value={filterText}
              onChangeText={setFilterText}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-lg mb-6 border border-gray-200 dark:border-gray-700"
            />
          }
          ListEmptyComponent={
            isLoading ? (
              <LoadingText message="Loading feed..." />
            ) : (
              <ThemedView className="flex-1 items-center justify-center py-12">
                <ThemedText className="text-gray-500 text-center">
                  {debouncedFilterText.trim()
                    ? `No posts found for "${debouncedFilterText.trim()}"`
                    : "No posts yet. Pull down to refresh or check back later!"}
                </ThemedText>
              </ThemedView>
            )
          }
          ListFooterComponent={
            isLoadingMore ? <ActivityIndicator color="#f04c00df" /> : null
          }
          renderItem={({ item }) => (
            <PostCard
              post={item}
              isExpanded={expandedPostId === item.id}
              onLike={handleLike}
              onToggleComments={handleToggleComments}
              onAddComment={handleAddComment}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
        />
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}
