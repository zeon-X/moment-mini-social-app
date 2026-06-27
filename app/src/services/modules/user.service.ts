import { apiRequest } from "../api/apiRequest"

type GetCommunityMembersParams = {
    page?: number;
    limit?: number;
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

export const getUserDetails = async (username: string) => {
    return await apiRequest(`/users/${username}`, 'GET')


}

export const getCommunityMembers = async ({ page = 1, limit = 10 }: GetCommunityMembersParams = {}) => {
    return await apiRequest(`/users${toQueryString({ page, limit })}`, 'GET')

}
