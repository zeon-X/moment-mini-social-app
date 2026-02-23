import { Alert, Platform } from "react-native";

type AlertOpts = {
  title?: string;
  message: string;
  okText?: string;
};

const isWeb = Platform.OS === "web";

export function CrossAlert({ title = "", message, okText = "OK" }: AlertOpts) {
  if (isWeb) {
    // Browser alert (blocks by default)
    if (typeof window !== "undefined")
      window.alert(`${title ? title + "\n\n" : ""}${message}`);
    return;
  }
  Alert.alert(title, message, [{ text: okText }], { cancelable: true });
}
