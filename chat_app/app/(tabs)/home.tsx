import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { View } from "react-native";
import { width } from "root/constants/Dimensions";
import { useAuthentication } from "root/hooks/auth/useAuthentication";

export default function Homepage() {
  const { signOut } = useAuthentication();

  console.log("Homepage ===");
  return (
    <View style={{ height: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          marginRight: width * 0.04,
          marginTop: 10,
          borderRadius: width * 0.07,
          height: width * 0.125,
          width: width * 0.125,
          borderWidth: 1,
          alignSelf: "flex-end",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name="log-out"
          size={width * 0.08}
          onPress={async () => {
            const refreshToken = await AsyncStorage.getItem("tokens");
            if (!refreshToken) return;
            const parsedAccessToken = JSON.parse(refreshToken);
            signOut(parsedAccessToken);
          }}
        />
      </View>
      {/* <Button
        onPress={() => {
          signOut();
        }}
        label={"Logout"}
      />
      <Text>Homepage</Text> */}
    </View>
  );
}
