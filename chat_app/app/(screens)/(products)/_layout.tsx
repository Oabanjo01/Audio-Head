// app/(screens)/(products)/_layout.tsx
import { Stack } from "expo-router";

export default function ProductsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="editProduct" />
      <Stack.Screen name="productDetail" />
      <Stack.Screen name="chatScreen" />
    </Stack>
  );
}
