import { z } from "zod";

const MAX_CONTENT_LENGTH = 280;

const textContentSchema = (emptyMessage) =>
  z
    .string()
    .trim()
    .min(1, emptyMessage)
    .max(
      MAX_CONTENT_LENGTH,
      `Content must be at most ${MAX_CONTENT_LENGTH} characters`,
    );

export const createPostSchema = z.object({
  body: z.object({
    content: textContentSchema("Post content cannot be empty"),
  }),
});

export const paginationSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const commentSchema = z.object({
  body: z.object({
    content: textContentSchema("Comment cannot be empty"),
  }),
});
