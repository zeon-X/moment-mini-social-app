import { useAuth } from "@/context/auth-context";
import moment from "moment";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";
import { Avatar } from "./avatar";

export type Comment = {
  id: string;
  author: string;
  username: string;
  content: string;
  createdAt: Date;
};

type CommentsListProps = {
  comments: Comment[];
  onAddComment: (comment: Comment) => void;
};

export function CommentsList({ comments, onAddComment }: CommentsListProps) {
  const { userInfo } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = () => {
    if (newComment.trim().length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        author: userInfo?.name || "You",
        username: userInfo?.username || "you",
        content: newComment,
        createdAt: new Date(),
      };
      onAddComment(comment);
      setNewComment("");
      setIsSubmitting(false);
    }, 750);
  };

  return (
    <View className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      {/* Comments List */}
      <View className="mb-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <View
              key={comment.id}
              className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <View className="flex-row gap-2">
                <Avatar name={comment.author} size="sm" />
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <ThemedText type="defaultSemiBold">
                      {comment.author}
                    </ThemedText>
                    <ThemedText type="xs" className="text-gray-500">
                      @{comment.username}
                    </ThemedText>
                  </View>
                  <ThemedText type="xs" className="text-gray-500 mt-0.5">
                    {moment(comment.createdAt).fromNow()}
                  </ThemedText>
                  <ThemedText type="default" className="mt-1">
                    {comment.content}
                  </ThemedText>
                </View>
              </View>
            </View>
          ))
        ) : (
          <ThemedText type="small" className="text-gray-500 text-center py-2">
            No comments yet
          </ThemedText>
        )}
      </View>

      {/* Comment Input */}
      <View className="flex-row gap-2 items-end">
        <Avatar name={userInfo?.name || "A"} size="sm" />
        <View className="flex-1 flex-row gap-2">
          <TextInput
            placeholder="Write a comment..."
            placeholderTextColor="#999"
            value={newComment}
            onChangeText={setNewComment}
            multiline={false}
            maxLength={280}
            className="flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600"
          />
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={newComment.trim().length === 0 || isSubmitting}
            className="bg-orange-500 px-3 py-2 rounded-lg justify-center items-center disabled:opacity-50"
          >
            <ThemedText type="default" className="text-white font-bold">
              {isSubmitting ? "..." : "→"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
