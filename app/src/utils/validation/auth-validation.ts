// Validation functions for auth forms
import type {
    LoginFormData,
    LoginFormErrors,
    RegisterFormData,
    RegisterFormErrors,
} from "../../types/auth";

export function validateRegisterForm(formData: RegisterFormData): RegisterFormErrors {
    const newErrors: RegisterFormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";

    if (!formData.age.trim()) newErrors.age = "Age is required.";
    // else if (!/^\d+$/.test(formData.age.trim()))
    //     newErrors.age = "Age must be a number.";
    else if (Number(formData.age.trim()) <= 0)
        newErrors.age = "Age must be greater than 0.";

    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email.trim()))
        newErrors.email = "Invalid email address.";

    if (!formData.username.trim()) newErrors.username = "Username is required.";

    if (!formData.password.trim()) newErrors.password = "Password is required.";

    return newErrors;
}

export function validateLoginForm(formData: LoginFormData): LoginFormErrors {
    const newErrors: LoginFormErrors = {};

    if (!formData.identifier.trim()) newErrors.identifier = "Email or Username is required.";
    // else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.identifier.trim()))
    //     newErrors.identifier = "Invalid email address.";

    if (!formData.password.trim()) newErrors.password = "Password is required.";

    return newErrors;
}
