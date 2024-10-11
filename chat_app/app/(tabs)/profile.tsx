import React from "react";
import { Text } from "react-native";
import CustomWrapper from "root/utils/customWrapper";

export default function Profile() {
  console.log("Profile ===");
  return (
    <CustomWrapper
      title="Profile"
      rightHeaderIcon
      rightHeaderIconTitle="log-out"
    >
      <Text>Profile</Text>
    </CustomWrapper>
  );
}
