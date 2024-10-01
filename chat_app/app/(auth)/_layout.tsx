import "react-native-reanimated";

import { Stack } from "expo-router";

export default function AuthLayout() {
  console.log("AuthLayout mounted");
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="verifyEmail"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signUp"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
