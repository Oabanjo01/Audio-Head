import LottieView from "lottie-react-native";
import React from "react";
import { Modal, View } from "react-native";
import { Colors } from "root/constants/Colors";

export default function Loader() {
  console.log("Loading ====");
  return (
    <Modal transparent animationType="slide">
      <View
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: Colors.light.backDrop,
        }}
      >
        <LottieView
          source={require("root/assets/animations/loader.json")}
          autoPlay
          loop
          style={{ flex: 1, transform: [{ scale: 0.7 }] }}
        />
      </View>
    </Modal>
  );
}
