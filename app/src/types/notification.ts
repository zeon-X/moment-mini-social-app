// Notification types
export type Notification = {
    id: string;
    type: "like" | "comment";
    user: {
        name: string;
        username: string;
    };
    postPreview: string;
    timestamp: Date | string;
    read: boolean;
};

export type Pagination = {
    page: number;
    limit: number;
    itemCount: number;
    hasMore: boolean;
    nextPage: number | null;
};

export type NotificationsResponse = {
    success: boolean;
    data: Notification[];
    unreadCount?: number;
    pagination?: Pagination;
    message?: string;
};

export type UnreadNotificationCountResponse = {
    success: boolean;
    unreadCount: number;
    message?: string;
};

export type MarkNotificationReadResponse = {
    success: boolean;
    message: string;
    notificationId?: string;
    unreadCount: number;
};
