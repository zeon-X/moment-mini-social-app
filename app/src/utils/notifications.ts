import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { Platform } from "react-native"

export async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
        alert("Must use physical device for Push Notifications")
        return
    }

    if (Platform.OS === "web") return null

    const { status: existingStatus } =
        await Notifications.getPermissionsAsync()

    let finalStatus = existingStatus

    if (existingStatus !== "granted") {
        const { status } =
            await Notifications.requestPermissionsAsync()
        finalStatus = status
    }

    if (finalStatus !== "granted") {
        alert("Failed to get push token")
        return
    }

    const token = (await Notifications.getDevicePushTokenAsync()).data

    return token
}