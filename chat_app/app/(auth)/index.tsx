import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import AuthLayout from "root/components/auth/authLayout";
import { useAuthentication } from "root/hooks/auth/useAuthentication";
import { signInSchema } from "root/utils/validations";

export interface LoginProps {
  email: string;
  password: string;
}

const LoginInitialValues = {
  email: "",
  password: "",
};

const LoginScreen = () => {
  const { signIn } = useAuthentication();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={authStyles.keyboardAvoidingView}
    >
      <AuthLayout
        initialValues={LoginInitialValues}
        submit={async (newPayLoad) => {
          signIn(newPayLoad);
        }}
        secondButton="Sign up"
        firstButton="Forgot Password"
        title="Online Marketplace for Used Goods"
        subtitle="Buy or sell used goods with trust. Chat directly with sellers, ensuring
        a seamless, authentic experience."
        pathName="signUp"
        buttonLabel="Sign In"
        schema={signInSchema}
        signIn
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
