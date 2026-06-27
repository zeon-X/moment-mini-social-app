import { apiRequest } from "../api/apiRequest"

type GetUserNotificationsParams = {
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

export const getUserNotifications = async ({ page = 1, limit = 10 }: GetUserNotificationsParams = {}) => {
    return await apiRequest(`/notifications${toQueryString({ page, limit })}`, 'GET')
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
