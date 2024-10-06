import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import AuthLayout from "root/components/auth/authLayout";
import { SignInModel } from "root/constants/types/authFunctions";
import { authService } from "root/services/auth";
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
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={authStyles.keyboardAvoidingView}
    >
      <AuthLayout
        initialValues={LoginInitialValues}
        submit={async (newPayLoad) => {
          const response = await authService<SignInModel>({
            data: newPayLoad as SignInModel,
            endPoint: "sign-in",
            method: "post",
          });

          console.log(response, "response.userData");
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
