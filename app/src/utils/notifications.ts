import { CrossAlert } from "@/components/ui/cross-alert"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { Platform } from "react-native"

export async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
        CrossAlert({
            title: "Push Notifications",
            message: "Must use physical device for Push Notifications",
        })
        return
    }

    if (Platform.OS === "web") return null

    try {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync()

        let finalStatus = existingStatus

        if (existingStatus !== "granted") {
            const { status } =
                await Notifications.requestPermissionsAsync()
            finalStatus = status
        }

        if (finalStatus !== "granted") {
            CrossAlert({
                title: "Push Notifications",
                message: "Failed to get push token",
            })
            return
        }

        const token = (await Notifications.getDevicePushTokenAsync()).data

        return token
    } catch {
        CrossAlert({
            title: "Push Notifications",
            message: "Unable to register for push notifications.",
        })
        return null
    }
}
