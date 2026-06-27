import { apiRequest } from "../api/apiRequest"

type GetFeedParams = {
    page?: number;
    limit?: number;
    search?: string;
    authorUsername?: string;
}

const toQueryString = (params: Record<string, string | number | undefined>) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
            searchParams.append(key, String(value));
        }
    });

    const query = searchParams.toString();
    return query ? `?${query}` : "";
}

export const getFeed = async ({ page = 1, limit = 10, search, authorUsername }: GetFeedParams = {}) => {
    return await apiRequest(`/posts${toQueryString({ page, limit, search, authorUsername })}`, 'GET')
}

export const createPost = async (body: any) => {
    return await apiRequest('/posts', 'POST', body)
}
export const toggleLikeOnPost = async (postId: string) => {
    return await apiRequest(`/posts/${postId}/like`, 'POST')
}
export const commentOnPost = async (postId: string, body: any) => {
    return await apiRequest(`/posts/${postId}/comment`, 'POST', body)
}
