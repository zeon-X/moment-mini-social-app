import { CrossAlert } from "@/components/ui/cross-alert";

type ApiLikeError = {
  message?: string;
  error?: string;
};

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) => {
  if (error instanceof Error && error.message) return error.message;

  if (typeof error === "string" && error.trim()) return error;

  if (error && typeof error === "object") {
    const apiError = error as ApiLikeError;
    return apiError.message || apiError.error || fallback;
  }

  return fallback;
};

export const showErrorAlert = (
  error: unknown,
  fallback?: string,
  title = "Error",
) => {
  CrossAlert({
    title,
    message: getErrorMessage(error, fallback),
  });
};
