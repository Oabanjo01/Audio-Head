import React from "react";
import AuthLayout from "root/components/auth/authLayout";
import { useAuthentication } from "root/hooks/auth/useAuthentication";
import { signUpSchema } from "root/utils/validations";

import CustomWrapper from "../../utils/customWrapper";

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
  const { signUp } = useAuthentication();
  return (
    <CustomWrapper>
      <AuthLayout
        initialValues={SignUpInitialValues}
        submit={async (newPayLoad) => {
          signUp(newPayLoad);
        }}
        secondButton="Sign in"
        title="Online Marketplace for Used Goods"
        subtitle="Buy or sell used goods with trust. Chat directly with sellers, ensuring
        a seamless, authentic experience."
        signUp
        pathName=""
        firstButton="Forgot Password"
        buttonLabel="Sign Up"
        schema={signUpSchema}
      />
    </CustomWrapper>
  );
};

export default SignUpScreen;
