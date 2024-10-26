// app/(screens)/(cart)/_layout.tsx
import { Stack } from "expo-router";

export default function CartLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="cart" />
    </Stack>
  );
}
