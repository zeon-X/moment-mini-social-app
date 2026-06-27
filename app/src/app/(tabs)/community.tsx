import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import LoadingText from "@/components/ui/loading-text";
import { MemberCard } from "@/components/ui/member-card";
import { getCommunityMembers } from "@/services/modules/user.service";
import { showErrorAlert } from "@/utils/error-handler";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl } from "react-native";
import type { CommunityMember } from "@/types/community";

const PAGE_LIMIT = 10;

type Pagination = {
  page: number;
  limit: number;
  itemCount: number;
  hasMore: boolean;
  nextPage: number | null;
};

export default function CommunityTabScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const paginationRef = useRef<Pagination | null>(null);
  const isLoadingMoreRef = useRef(false);

  const loadMembers = useCallback(async (page = 1, shouldRefresh = false) => {
    if (page > 1 && (isLoadingMoreRef.current || !paginationRef.current?.hasMore)) return;

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
      const data = await getCommunityMembers({ page, limit: PAGE_LIMIT });

      if (data.success) {
        setMembers((prev) =>
          page === 1 ? data.data : [...prev, ...data.data],
        );
        const nextPagination = data.pagination ?? null;
        paginationRef.current = nextPagination;
        setPagination(nextPagination);
      } else {
        showErrorAlert(data.message, "Unable to load community members.");
      }
    } catch (error) {
      showErrorAlert(error, "Unable to load community members.");
    } finally {
      if (page === 1) {
        setIsLoading(false);
        setIsRefreshing(false);
      } else {
        isLoadingMoreRef.current = false;
        setIsLoadingMore(false);
      }
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    await loadMembers(1, members.length > 0);
  }, [loadMembers, members.length]);

  const handleLoadMore = useCallback(() => {
    if (pagination?.hasMore && pagination.nextPage && !isLoadingMore) {
      loadMembers(pagination.nextPage);
    }
  }, [isLoadingMore, loadMembers, pagination?.hasMore, pagination?.nextPage]);

  useFocusEffect(
    useCallback(() => {
      loadMembers(1);
    }, [loadMembers]),
  );

  return (
    <ScreenLayout
      title="Community"
      subtitle={
        members.length === 0 && isLoading
          ? "Loading..."
          : `${members?.length || 0} members`
      }
      scrollViewClassName="flex-1"
      contentClassName="flex-1"
      scrollable={false}
      contentContainerProps={{ style: { flex: 1 } }}
    >
      <FlatList
        data={members}
        keyExtractor={(member) => member.id}
        contentContainerClassName="px-4 py-6 pb-8"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#f04c00df"
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <LoadingText message="Loading members..." />
          ) : (
            <ThemedView className="items-center justify-center py-12">
              <ThemedText type="small" className="text-gray-500">
                No members found
              </ThemedText>
            </ThemedView>
          )
        }
        ListFooterComponent={
          isLoadingMore ? <ActivityIndicator color="#f04c00df" /> : null
        }
        renderItem={({ item }) => <MemberCard member={item} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
      />
    </ScreenLayout>
  );
}
