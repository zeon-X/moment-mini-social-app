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

export type NotificationsResponse = {
    success: boolean;
    data: Notification[];
    unreadCount: number;
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
