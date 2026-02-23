import { SplashScreen } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function SplashScreenController({
  isLoading,
}: {
  isLoading: boolean;
}) {
  if (!isLoading) {
    SplashScreen.hide();
  }

  return null;
}
