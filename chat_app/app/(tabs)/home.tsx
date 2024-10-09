import React from "react";
import { Text, View } from "react-native";
import Button from "root/components/auth/Button";
import { useAuthentication } from "root/hooks/auth/useAuthentication";

export default function Homepage() {
  const { signOut } = useAuthentication();

  console.log("Homepage ===");
  return (
    <View
      style={{ height: "100%", alignItems: "center", justifyContent: "center" }}
    >
      <Button
        onPress={() => {
          signOut();
        }}
        label={"Logout"}
      />
      <Text>Homepage</Text>
    </View>
  );
}
