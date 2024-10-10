import "react-native-reanimated";

import { Stack } from "expo-router";

export default function AuthLayout() {
  console.log("AuthLayout:");
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="verifyEmail" />
      <Stack.Screen name="signUp" />
      <Stack.Screen name="forgotPassord" />
    </Stack>
  );
}
