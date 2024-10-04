import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import AuthLayout from "root/components/auth/authLayout";

export interface LoginProps {
  email: string;
  password: string;
}

const LoginInitialValues = {
  email: "",
  password: "",
};

const LoginScreen = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={authStyles.keyboardAvoidingView}
    >
      <AuthLayout
        initialValues={LoginInitialValues}
        submit={() => {}}
        secondButton="Sign up"
        title="Online Marketplace for Used Goods"
        subtitle="Buy or sell used goods with trust. Chat directly with sellers, ensuring
        a seamless, authentic experience."
        pathName="signUp"
      />
    </KeyboardAvoidingView>
  );
};

export const authStyles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default LoginScreen;
