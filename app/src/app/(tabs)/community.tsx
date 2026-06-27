import { ScreenLayout } from "@/components/screen-layout";
import LoadingText from "@/components/ui/loading-text";
import { MemberCard } from "@/components/ui/member-card";
import { getCommunityMembers } from "@/services/modules/user.service";
import { showErrorAlert } from "@/utils/error-handler";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import type { CommunityMember } from "../../types/community";

export default function CommunityTabScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<CommunityMember[]>([]);

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, []),
  );

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await getCommunityMembers();

      if (data.success) {
        setMembers(data.data);
      } else {
        showErrorAlert(data.message, "Unable to load community members.");
      }
    } catch (error) {
      showErrorAlert(error, "Unable to load community members.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenLayout
      title="Community"
      subtitle={
        members.length === 0 && isLoading
          ? "Loading..."
          : `${members?.length || 0} members`
      }
      scrollViewClassName="flex-1"
      contentClassName="px-4 py-6"
      onRefresh={handleRefresh}
    >
      {/* Member List */}
      {members.length === 0 && isLoading ? (
        <LoadingText message="Loading members..." />
      ) : (
        members?.map((member) => <MemberCard key={member.id} member={member} />)
      )}
    </ScreenLayout>
  );
}
