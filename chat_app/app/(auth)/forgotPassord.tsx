import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import AuthLayout from "root/components/auth/authLayout";

import { authStyles } from ".";

export interface VerifyEmailProps {
  email: string;
}

const VerifyEmailValues = {
  email: "",
};

const VerifyEmailScreen = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={authStyles.keyboardAvoidingView}
    >
      <AuthLayout
        submit={() => {}}
        initialValues={VerifyEmailValues}
        secondButton="Sign up"
        title="Online Marketplace for Used Goods"
        subtitle="Buy or sell used goods with trust. Chat directly with sellers, ensuring
        a seamless, authentic experience."
        pathName=""
      />
    </KeyboardAvoidingView>
  );
};

export default VerifyEmailScreen;
