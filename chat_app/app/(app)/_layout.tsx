import "react-native-reanimated";

import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack initialRouteName="homepage">
      <Stack.Screen
        name="homepage"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
