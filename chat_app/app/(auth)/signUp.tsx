import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import AuthLayout from "root/components/auth/authLayout";

import { authStyles } from ".";

export interface SignUpProps {
  name: string;
  email: string;
  password: string;
}

const SignUpInitialValues = {
  name: "",
  email: "",
  password: "",
};

const SignUpScreen = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={authStyles.keyboardAvoidingView}
    >
      <AuthLayout
        initialValues={SignUpInitialValues}
        submit={() => {}}
        secondButton="Sign in"
        title="Online Marketplace for Used Goods"
        subtitle="Buy or sell used goods with trust. Chat directly with sellers, ensuring
        a seamless, authentic experience."
        signUp
        pathName=""
      />
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
