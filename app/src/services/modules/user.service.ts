import { apiRequest } from "../api/apiRequest"

export const getUserDetails = async (username: string) => {
    return await apiRequest(`/users/${username}`, 'GET')


}

export const getCommunityMembers = async () => {
    return await apiRequest(`/users`, 'GET')

}