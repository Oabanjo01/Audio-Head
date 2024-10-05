import axios, { AxiosError } from "axios";
import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import AuthLayout from "root/components/auth/authLayout";
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
        submit={async (newPayLoad: any) => {
          try {
            const { data } = await axios.post("sign-in", newPayLoad);
            console.log(data, "data ===>");
          } catch (error) {
            if (error instanceof AxiosError) {
              const response = error.response;
              if (response) {
                const { message } = response.data;
                console.log("Axios error", message);
              }
            }
          }
          // await signIn("sign-in", newPayLoad);
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
