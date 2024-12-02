import React from "react";
import { StyleSheet } from "react-native";
import AuthLayout from "root/components/auth/authLayout";
import CustomWrapper from "root/components/custom/customScrollableWrapper";
import { useAuthentication } from "root/utils/hooks/auth/useAuthentication";
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
    <CustomWrapper showBackgroundImage>
      <AuthLayout
        initialValues={LoginInitialValues}
        submit={async (newPayLoad) => {
          signIn(newPayLoad);
        }}
        secondButton="Sign up"
        firstButton="Forgot Password"
        title="Online Marketplace for Used Goods"
        subtitle="Buy or sell used goods with trust. Chat directly with sellers, ensuring a seamless, authentic experience."
        pathName="signUp"
        buttonLabel="Sign In"
        schema={signInSchema}
        signIn
      />
    </CustomWrapper>
  );
};

const styles = StyleSheet.create({});
export default LoginScreen;
