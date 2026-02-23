import { Alert, Platform } from "react-native";

type ConfirmOpts = {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
};

const isWeb = Platform.OS === "web";

// Promise-based confirm so you can await it
export function CrossConfirm({
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "OK",
  cancelText = "Cancel",
  destructive = false,
}: ConfirmOpts): Promise<boolean> {
  if (isWeb) {
    const ok =
      typeof window !== "undefined"
        ? window.confirm(`${title ? title + "\n\n" : ""}${message}`)
        : false;
    return Promise.resolve(ok);
  }

  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: cancelText, style: "cancel", onPress: () => resolve(false) },
        {
          text: confirmText,
          style: destructive ? "destructive" : "default",
          onPress: () => resolve(true),
        },
      ],
      { cancelable: true },
    );
  });
}
