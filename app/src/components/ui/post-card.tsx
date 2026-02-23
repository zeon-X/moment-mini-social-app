import moment from "moment";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { Avatar } from "./avatar";
import { CommentsList, type Comment } from "./comments-list";
import { IconSymbol } from "./icon-symbol";

export type Post = {
  id: string;
  author: string;
  username: string;
  content: string;
  createdAt: Date;
  likes: number;
  comments: Comment[];
  liked: boolean;
};

type PostCardProps = {
  post: Post;
  isExpanded?: boolean;
  onLike?: (postId: string) => void;
  onToggleComments?: (postId: string) => void;
  onAddComment?: (postId: string, comment: Comment) => void;
};

export function PostCard({
  post,
  isExpanded = false,
  onLike,
  onToggleComments,
  onAddComment,
}: PostCardProps) {
  return (
    <ThemedView className="mb-4 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
      {/* Header */}
      <View className="flex-row items-center gap-3 mb-3">
        <Avatar name={post.author} size="md" />
        <View className="flex-1">
          <ThemedText type="defaultSemiBold">{post.author}</ThemedText>
          <ThemedText type="xs" className="text-gray-500">
            @{post.username} • {moment(post.createdAt).fromNow()}
          </ThemedText>
        </View>
      </View>

      {/* Content */}
      <ThemedText type="default" className="leading-6 mb-4">
        {post.content}
      </ThemedText>

      {/* Action Buttons */}
      <View className="flex-row gap-8 pt-3 border-t border-gray-200 dark:border-gray-700">
        {/* Like Button */}
        <TouchableOpacity
          className="flex-row items-center gap-2"
          onPress={() => onLike?.(post.id)}
        >
          <IconSymbol
            size={20}
            name="heart.fill"
            color={post.liked ? "#FF6B6B" : "#999"}
          />
          <ThemedText
            type="small"
            className={`font-medium ${
              post.liked ? "text-red-500" : "text-gray-500"
            }`}
          >
            {post.likes}
          </ThemedText>
        </TouchableOpacity>

        {/* Comment Button */}
        <TouchableOpacity
          className="flex-row items-center gap-2"
          onPress={() => onToggleComments?.(post.id)}
        >
          <IconSymbol size={20} name="bubble.right.fill" color="#999" />
          <ThemedText type="small" className="font-medium text-gray-500">
            {post.comments.length}
          </ThemedText>
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity className="flex-row items-center gap-2">
          <IconSymbol size={20} name="paperplane.fill" color="#999" />
          <ThemedText type="small" className="font-medium text-gray-500">
            Share
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      {isExpanded && (
        <CommentsList
          comments={post.comments}
          onAddComment={(comment) => onAddComment?.(post.id, comment)}
        />
      )}
    </ThemedView>
  );
}
