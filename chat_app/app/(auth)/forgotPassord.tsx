import React from "react";
import AuthLayout from "root/components/auth/authLayout";
import { useAuthentication } from "root/utils/hooks/auth/useAuthentication";
import { forgotPasswordSchema } from "root/utils/validations";

import CustomWrapper from "../../components/custom/customScrollableWrapper";

export interface ForgotPassswordProps {
  email: string;
}

const ForgotPassswordValues = {
  email: "",
};

const ForgotPassswordScreen = () => {
  const { forgotPassword } = useAuthentication();
  return (
    <CustomWrapper>
      <AuthLayout
        submit={async (email) => {
          forgotPassword(email);
        }}
        initialValues={ForgotPassswordValues}
        secondButton="Sign up"
        firstButton="Forgot Password"
        title="Online Marketplace for Used Goods"
        subtitle="Buy or sell used goods with trust. Chat directly with sellers, ensuring
        a seamless, authentic experience."
        pathName=""
        buttonLabel="Request Link"
        schema={forgotPasswordSchema}
      />
    </CustomWrapper>
  );
};

export default ForgotPassswordScreen;
