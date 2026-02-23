// User profile types
export type UserProfile = {
    name: string;
    age: number;
    email: string;
    username: string;
    stats: {
        posts: number;
        comments: number;
        likes: number;
    };
    posts: Post[];
};

export type UserInfo = {
    name: string;
    age: number;
    email: string;
    username: string;
};

// Post types
export type Post = {
    id: string;
    author: string;
    username: string;
    content: string;
    createdAt: Date;
    likes: number;
    comments: Comment[];
    liked: boolean;
};

// Comment types
export type Comment = {
    id: string;
    author: string;
    username: string;
    content: string;
    createdAt: Date;
};
