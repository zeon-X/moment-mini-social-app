import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Avatar } from "@/components/ui/avatar";
import { CrossConfirm } from "@/components/ui/cross-confirm";
import LoadingText from "@/components/ui/loading-text";
import { PostCard, type Post } from "@/components/ui/post-card";
import { StatCard } from "@/components/ui/stat-card";
import { getMe } from "@/services/modules/auth.service";
import {
  commentOnPost,
  getFeed,
  toggleLikeOnPost,
} from "@/services/modules/post.service";
import { getUserDetails } from "@/services/modules/user.service";
import { showErrorAlert } from "@/utils/error-handler";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/auth-context";
import type { Comment, UserProfile } from "../../types/user";

const PAGE_LIMIT = 10;

type Pagination = {
  page: number;
  limit: number;
  itemCount: number;
  hasMore: boolean;
  nextPage: number | null;
};

const SAMPLE_USER: UserProfile = {
  name: "",
  age: 0,
  email: "",
  username: "",
  stats: { posts: 0, comments: 0, likes: 0 },
};

const ProfileTabScreen = () => {
  const { clearSession, setUserInfo, userInfo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [user, setUser] = useState<UserProfile>(SAMPLE_USER);
  const [posts, setPosts] = useState<Post[]>([]);
  const [likingPostIds, setLikingPostIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const paginationRef = useRef<Pagination | null>(null);
  const isLoadingMoreRef = useRef(false);

  const resolveUsername = useCallback(async () => {
    if (userInfo?.username) return userInfo.username;

    const data = await getMe();
    if (data.success) {
      setUserInfo(data.data);
      return data.data.username;
    }

    showErrorAlert(data.message, "Unable to load your profile.");
    return null;
  }, [setUserInfo, userInfo?.username]);

  const loadUserDetails = useCallback(async (username: string) => {
    try {
      const data = await getUserDetails(username);

      if (data.success) {
        setUser(data.data);
        return true;
      } else {
        showErrorAlert(data.message, "Unable to load profile.");
      }
    } catch (error) {
      showErrorAlert(error, "Unable to load profile.");
    }
    return false;
  }, []);

  const loadPosts = useCallback(
    async (username: string, page = 1) => {
      if (
        page > 1 &&
        (isLoadingMoreRef.current || !paginationRef.current?.hasMore)
      )
        return;

      if (page > 1) {
        isLoadingMoreRef.current = true;
        setIsLoadingMore(true);
      }

      try {
        const data = await getFeed({
          page,
          limit: PAGE_LIMIT,
          search: username,
          authorUsername: username,
        });

        if (data.success) {
          const profilePosts = data.data.filter(
            (post: Post) => post.username === username,
          );
          setPosts((prev) =>
            page === 1 ? profilePosts : [...prev, ...profilePosts],
          );
          const nextPagination = data.pagination ?? null;
          paginationRef.current = nextPagination;
          setPagination(nextPagination);
        } else {
          showErrorAlert(data.message, "Unable to load posts.");
        }
      } catch (error) {
        showErrorAlert(error, "Unable to load posts.");
      } finally {
        if (page > 1) {
          isLoadingMoreRef.current = false;
          setIsLoadingMore(false);
        }
      }
    },
    [],
  );

  const loadProfile = useCallback(
    async (shouldRefresh = false) => {
      if (shouldRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const username = await resolveUsername();
        if (!username) {
          setPosts([]);
          setPagination(null);
          paginationRef.current = null;
          return;
        }

        paginationRef.current = null;
        setPagination(null);
        await Promise.all([loadUserDetails(username), loadPosts(username, 1)]);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [loadPosts, loadUserDetails, resolveUsername],
  );

  const handleRefresh = useCallback(async () => {
    await loadProfile(posts.length > 0 || user.username !== "");
  }, [loadProfile, posts.length, user.username]);

  const handleLoadMore = useCallback(() => {
    if (pagination?.hasMore && pagination.nextPage && !isLoadingMore) {
      const username = user.username || userInfo?.username;
      if (username) {
        loadPosts(username, pagination.nextPage);
      }
    }
  }, [
    isLoadingMore,
    loadPosts,
    pagination?.hasMore,
    pagination?.nextPage,
    user.username,
    userInfo?.username,
  ]);

  const refreshProfileStats = useCallback(async () => {
    const username = user.username || userInfo?.username;
    if (username) {
      await loadUserDetails(username);
    }
  }, [loadUserDetails, user.username, userInfo?.username]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

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
      try {
        await clearSession();
      } catch (error) {
        showErrorAlert(error, "Unable to logout.");
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  const handleLike = async (postId: string) => {
    if (likingPostIds.has(postId)) return;

    setLikingPostIds((prev) => new Set(prev).add(postId));
    try {
      const data = await toggleLikeOnPost(postId);

      if (!data.success) {
        showErrorAlert(data.message, "Unable to update like.");
        return;
      }

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: !post.liked,
                likes: post.liked ? post.likes - 1 : post.likes + 1,
              }
            : post,
        ),
      );
      await refreshProfileStats();
    } catch (error) {
      showErrorAlert(error, "Unable to update like.");
    } finally {
      setLikingPostIds((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
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
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  { ...comment, content: comment.content.trim() },
                ],
              }
            : post,
        ),
      );
      await refreshProfileStats();
    } catch (error) {
      showErrorAlert(error, "Unable to add comment.");
    }
  };

  const handleToggleComments = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const hasUserDetails = Boolean(user.name && user.username);
  const shouldShowUserInfoLoader = !hasUserDetails;

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
      contentClassName="flex-1"
      scrollViewClassName="flex-1"
      scrollable={false}
      contentContainerProps={{ style: { flex: 1 } }}
    >
      <FlatList
        data={posts}
        keyExtractor={(post) => post.id}
        contentContainerClassName="px-4 py-6 pb-8"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#f04c00df"
          />
        }
        ListHeaderComponent={
          <>
            {shouldShowUserInfoLoader ? (
              <View className="items-center justify-center py-10 mb-4">
                <ActivityIndicator color="#f04c00df" />
              </View>
            ) : (
              <>
                <View className="items-center mb-4">
                  <Avatar name={user?.name} size="lg" />
                </View>

                <View className="items-center mb-4">
                  <ThemedText type="defaultSemiBold" className="text-xl mb-1">
                    {user?.name}
                  </ThemedText>
                  <ThemedText type="small" className="text-gray-500">
                    @{user?.username} {user?.email && "|"} {user?.email}
                  </ThemedText>
                </View>

                <View className="flex-row gap-3 mb-8">
                  <StatCard value={user?.stats?.posts} label="Posts" />
                  <StatCard value={user?.stats?.comments} label="Comments" />
                  <StatCard value={user?.stats?.likes} label="Likes" />
                </View>
              </>
            )}

            <ThemedText type="defaultSemiBold" className="text-lg mb-4">
              My Posts
            </ThemedText>
          </>
        }
        ListEmptyComponent={
          isLoading ? (
            <LoadingText message="Loading profile..." />
          ) : (
            <ThemedText type="small" className="text-gray-500 text-center py-4">
              No posts yet
            </ThemedText>
          )
        }
        ListFooterComponent={
          isLoadingMore ? <ActivityIndicator color="#f04c00df" /> : null
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            isExpanded={expandedPostId === item.id}
            isLikeLoading={likingPostIds.has(item.id)}
            onLike={handleLike}
            onToggleComments={handleToggleComments}
            onAddComment={handleAddComment}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
      />
    </ScreenLayout>
  );
};

export default ProfileTabScreen;
