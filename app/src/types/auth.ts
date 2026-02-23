// Registration form types
export type RegisterFormData = {
    name: string;
    age: string;
    email: string;
    username: string;
    password: string;
    message?: string;
};

export type RegisterFormErrors = Partial<Record<keyof RegisterFormData, string>>;

// Login form types
export type LoginFormData = {
    identifier: string;
    password: string;
    message?: string;
};

export type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;
