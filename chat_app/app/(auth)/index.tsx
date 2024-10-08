import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import AuthLayout from "root/components/auth/authLayout";
import { LoginResponse, SignInModel } from "root/constants/types/authTypes";
import { login } from "root/redux/slices/authSlice";
import { useAppDispatch } from "root/redux/store";
import { authService } from "root/services/auth";
import { logErrorDetails } from "root/utils/customErrorLogger";
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
  const dispatch = useAppDispatch();

  console.log("LoginScreen === ");
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={authStyles.keyboardAvoidingView}
    >
      <AuthLayout
        initialValues={LoginInitialValues}
        submit={async (newPayLoad) => {
          const response = await authService<SignInModel, "sign-in">({
            data: newPayLoad as SignInModel,
            endPoint: "sign-in",
            method: "post",
          })
            .then(async (response) => {
              console.log(response, "responessss");

              const { tokens, userData } = response as LoginResponse;

              const token = JSON.stringify(tokens);

              await AsyncStorage.setItem("tokens", token);
              router.replace("/(app)/home");
              dispatch(login(userData));
              console.log(response, "response.userData");
            })
            .catch((error) => {
              logErrorDetails(error);
            });
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
