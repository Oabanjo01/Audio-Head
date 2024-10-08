import "react-native-reanimated";

import { Stack } from "expo-router";

export default function AppLayout() {
  console.log("AppLayout: ");
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="home" />
    </Stack>
  );
}
