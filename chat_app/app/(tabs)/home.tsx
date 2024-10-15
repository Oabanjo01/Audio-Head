import React from "react";
import { Text } from "react-native";
import CustomWrapper from "root/components/customWrapper";

export default function Homepage() {
  return (
    <CustomWrapper title="Home" rightHeaderIcon rightHeaderIconTitle="log-out">
      <Text>Home</Text>
      {/* <Button
        onPress={() => {
          signOut();
        }}
        label={"Logout"}
      />
      <Text>Homepage</Text> */}
    </CustomWrapper>
  );
}
