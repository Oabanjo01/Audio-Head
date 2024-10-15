import React from "react";
import AuthLayout from "root/components/auth/authLayout";
import { useAuthentication } from "root/hooks/auth/useAuthentication";
import { signInSchema } from "root/utils/validations";

import CustomWrapper from "../../components/customWrapper";

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
    <CustomWrapper>
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
    </CustomWrapper>
  );
};

export default LoginScreen;
