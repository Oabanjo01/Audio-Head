import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function signIn() {
  const { height, width } = Dimensions.get("window");
  return (
    <SafeAreaView>
      <View
        style={{
          alignItems: "center",
        }}
      >
        <Image
          source={require("root/assets/loginimage.png")}
          resizeMode="contain"
          style={{
            width: width * 1,
            height: width * 0.5,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
