// Notification types
export type Notification = {
    id: string;
    type: "like" | "comment";
    user: {
        name: string;
        username: string;
    };
    postPreview: string;
    timestamp: Date;
    read: boolean;
};
