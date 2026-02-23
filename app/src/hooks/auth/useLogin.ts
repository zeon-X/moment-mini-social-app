import { useAuth } from "@/context/auth-context";
import { loginUser, saveToken } from "@/services/modules/auth.service";
import { LoginFormData, LoginFormErrors } from "@/types/auth";
import { registerForPushNotificationsAsync } from "@/utils/notifications";
import { saveToSecureStore } from "@/utils/useSecureStorage";
import { validateLoginForm } from "@/utils/validation/auth-validation";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard } from "react-native";

export const useLogin = () => {
    const { setSession, setUserInfo } = useAuth();

    const router = useRouter();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [formData, setFormData] = useState<LoginFormData>({
        identifier: "",
        password: "",
    });
    const [errors, setErrors] = useState<LoginFormErrors>({});

    const handleChange = (field: keyof LoginFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const loginFormValidate = () => {
        const newErrors = validateLoginForm(formData);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        Keyboard.dismiss();
        if (!loginFormValidate()) return;

        // Login logic here
        setIsLoggingIn(true);
        const data = await loginUser(formData)





        const token = await registerForPushNotificationsAsync()

        if (data.success) {
            saveToSecureStore("token", data?.token);

            setSession(data?.token);
            setUserInfo(data?.data);

            await saveToken({ token });
        }
        else {
            setErrors((prev) => ({
                ...prev,
                message: data.message,
            }));
        }

        setIsLoggingIn(false);
    };
    return { router, formData, errors, handleChange, isLoggingIn, handleLogin }
}