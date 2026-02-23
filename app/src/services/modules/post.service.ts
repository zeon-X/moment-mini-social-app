import { apiRequest } from "../api/apiRequest"

export const getFeed = async () => {
    return await apiRequest('/posts', 'GET')
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