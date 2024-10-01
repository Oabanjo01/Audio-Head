import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "root/components/auth/Button";
import TextField from "root/components/auth/TextField";
import { height, width } from "root/constants/Dimensions";
import images from "root/constants/Images";

export default function signIn() {
  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        style={{
          alignItems: "center",
          height: "100%",
          backgroundColor: "white",
          paddingTop: height * 0.05,
        }}
      >
        <Image
          source={images.authImage}
          resizeMode="contain"
          style={{
            width: width * 0.75,
            height: height * 0.4,
          }}
        />
        <Text
          style={{
            textAlign: "center",
            fontWeight: "600",
            fontSize: 20,
            marginBottom: 10,
          }}
        >
          Online Marketplace for Used Goods
        </Text>
        <Text style={{ textAlign: "center", marginBottom: height * 0.025 }}>
          Buy or sell used goods with trust.Chat directly with sellers, ensuring
          a seamless, authentic experience.
        </Text>

        <TextField label="Email" />
        <TextField label="Password" />

        <Button label={"Login"} />

        <View
          style={{
            height: 2,
            backgroundColor: "grey",
            width: width * 0.6,
            alignItems: "center",
            borderRadius: 5,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: height * 0.03,
            width: "90%",
          }}
        >
          <Text>Forgot Password?</Text>
          <Text>Sign Up</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
