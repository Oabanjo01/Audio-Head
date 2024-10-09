import React from "react";
import { Text, View } from "react-native";
import Button from "root/components/auth/Button";
import { useAuthentication } from "root/hooks/auth/useAuthentication";

export default function Profile() {
  const { signOut } = useAuthentication();

  console.log("Profile ===");
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
      <Text>Profile</Text>
    </View>
  );
}
