import "react-native-reanimated";

import { Stack } from "expo-router";

export default function AppLayout() {
  console.log("AppLayout mounted");
  return (
    <Stack>
      <Stack.Screen
        name="homepage"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}