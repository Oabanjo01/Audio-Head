import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import AuthLayout from "root/components/auth/authLayout";
import { useAuthentication } from "root/hooks/auth/useAuthentication";
import { forgotPasswordSchema } from "root/utils/validations";

import { authStyles } from ".";

export interface VerifyEmailProps {
  email: string;
}

const VerifyEmailValues = {
  email: "",
};

const VerifyEmailScreen = () => {
  const { forgotPassword } = useAuthentication();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={authStyles.keyboardAvoidingView}
    >
      <AuthLayout
        submit={async (email) => {
          forgotPassword(email);
        }}
        initialValues={VerifyEmailValues}
        secondButton="Sign up"
        firstButton="Forgot Password"
        title="Online Marketplace for Used Goods"
        subtitle="Buy or sell used goods with trust. Chat directly with sellers, ensuring
        a seamless, authentic experience."
        pathName=""
        buttonLabel="Request Link"
        schema={forgotPasswordSchema}
      />
    </KeyboardAvoidingView>
  );
};

export default VerifyEmailScreen;
