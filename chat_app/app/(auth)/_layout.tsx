import "react-native-reanimated";

import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack initialRouteName="signIn">
      <Stack.Screen
        name="signIn"
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
