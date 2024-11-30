import "react-native-reanimated";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "root/redux/store";

import { AuthProvider } from "./authProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const fonts = {
  SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  DM_Sans_Black: require("../assets/fonts/DMSans-Black.ttf"),
  DM_Sans_Bold: require("../assets/fonts/DMSans-Bold.ttf"),
  DM_Sans_Extra_Bold: require("../assets/fonts/DMSans-ExtraBold.ttf"),
  DM_Sans_Extra_Bold_Italic: require("../assets/fonts/DMSans-ExtraBoldItalic.ttf"),
  DM_Sans_Extra_Light: require("../assets/fonts/DMSans-ExtraLight.ttf"),
  DM_Sans_Extra_Light_Italic: require("../assets/fonts/DMSans-ExtraLightItalic.ttf"),
  DM_Sans_Italic: require("../assets/fonts/DMSans-Italic.ttf"),
  DM_Sans_Light: require("../assets/fonts/DMSans-Light.ttf"),
  DM_Sans_Light_Italic: require("../assets/fonts/DMSans-LightItalic.ttf"),
  DM_Sans_Medium: require("../assets/fonts/DMSans-Medium.ttf"),
  DM_Sans_Medium_Italic: require("../assets/fonts/DMSans-MediumItalic.ttf"),
  DM_Sans_Regular: require("../assets/fonts/DMSans-Regular.ttf"),
  DM_Sans_Semi_Bold: require("../assets/fonts/DMSans-SemiBold.ttf"),
  DM_Sans_Thin: require("../assets/fonts/DMSans-Thin.ttf"),
  DM_Sans_Thin_Italic: require("../assets/fonts/DMSans-ThinItalic.ttf"),
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    ...fonts,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <AuthProvider />
            </ThemeProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
