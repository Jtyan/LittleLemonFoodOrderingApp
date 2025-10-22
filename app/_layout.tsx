import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import HeaderLogo from "../component/HeaderLogo";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Karla-ExtraLight": require("../assets/fonts/Karla-ExtraLight.ttf"),
    "Karla-Light": require("../assets/fonts/Karla-Light.ttf"),
    "Karla-Regular": require("../assets/fonts/Karla-Regular.ttf"),
    "Karla-Medium": require("../assets/fonts/Karla-Medium.ttf"),
    "Karla-SemiBold": require("../assets/fonts/Karla-SemiBold.ttf"),
    "Karla-Bold": require("../assets/fonts/Karla-Bold.ttf"),
    "Karla-ExtraBold": require("../assets/fonts/Karla-ExtraBold.ttf"),
    "MarkaziText-Bold": require("../assets/fonts/MarkaziText-Bold.ttf"),
    "MarkaziText-SemiBold": require("../assets/fonts/MarkaziText-SemiBold.ttf"),
    "MarkaziText-Medium": require("../assets/fonts/MarkaziText-Medium.ttf"),
    "MarkaziText-Regular": require("../assets/fonts/MarkaziText-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerTitle: () => <HeaderLogo />,
        headerTitleAlign: "center",
      }}
    />
  );
}
