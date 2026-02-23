import { apiRequest } from "../api/apiRequest"

export const getUserNotifications = async () => {
    return await apiRequest('/notifications', 'GET')
}

export const markNotificationAsRead = async (notificationId: string) => {
    return await apiRequest(`/notifications/${notificationId}/read`, 'PATCH')
}
export const getUnreadNotificationCount = async () => {
    return await apiRequest('/notifications/unread-count', 'GET')
}

// export const markAllNotificationsAsRead = async () => {
//     return await apiRequest('/notifications/read-all', 'POST')
// }