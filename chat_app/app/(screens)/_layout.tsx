// app/(screens)/_layout.tsx
import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(cart)" />
      <Stack.Screen name="(products)" />
      <Stack.Screen name="(profile)" />
    </Stack>
  );
}
