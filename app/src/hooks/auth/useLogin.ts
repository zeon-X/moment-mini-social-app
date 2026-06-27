import { useAuth } from "@/context/auth-context";
import { loginUser, saveToken } from "@/services/modules/auth.service";
import { LoginFormData, LoginFormErrors } from "@/types/auth";
import { registerForPushNotificationsAsync } from "@/utils/notifications";
import { getErrorMessage, showErrorAlert } from "@/utils/error-handler";
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

        setIsLoggingIn(true);
        try {
            const data = await loginUser(formData)

            if (data.success) {
                await saveToSecureStore("token", data?.token);

                await setSession(data?.token);
                setUserInfo(data?.data);

                const token = await registerForPushNotificationsAsync()

                if (token) {
                    try {
                        await saveToken({ token });
                    } catch (error) {
                        showErrorAlert(
                            error,
                            "Logged in, but unable to enable push notifications.",
                            "Push Notifications",
                        );
                    }
                }
            }
            else {
                const message = data.message || "Unable to login. Please try again.";
                setErrors((prev) => ({
                    ...prev,
                    message,
                }));
                showErrorAlert(message, undefined, "Login Failed");
            }
        } catch (error) {
            const message = getErrorMessage(error, "Unable to login. Please try again.");
            setErrors((prev) => ({
                ...prev,
                message,
            }));
            showErrorAlert(message, undefined, "Login Failed");
        } finally {
            setIsLoggingIn(false);
        }
    };
    return { router, formData, errors, handleChange, isLoggingIn, handleLogin }
}
