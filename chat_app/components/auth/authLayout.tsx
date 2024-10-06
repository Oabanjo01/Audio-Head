import { Link } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { height, width } from "root/constants/Dimensions";
import images from "root/constants/Images";
import { AuthData } from "root/services/auth";
import {
  ForgotPasswordSchemaType,
  SignInSchemaType,
  SignUpSchemaType,
} from "root/utils/validations";
import { ObjectSchema } from "yup";

import Button from "./Button";
import TextField from "./TextField";
import TextFieldError from "./TextFieldError";

type SchemaType =
  | SignInSchemaType
  | ForgotPasswordSchemaType
  | SignUpSchemaType;

type initialValueType = {
  email: string;
  password?: string;
  name?: string;
};

interface AuthLayoutProp {
  title: string;
  subtitle: string;
  initialValues: initialValueType;
  submit: (newPayLoad: AuthData) => Promise<void> | void;
  firstButton: string;
  secondButton: string;
  pathName: "signUp" | "verifyEmail" | "";
  signUp?: boolean;
  signIn?: boolean;
  buttonLabel: string;
  schema: ObjectSchema<SchemaType>;
}

const AuthLayout: React.FC<AuthLayoutProp> = ({
  initialValues,
  submit,
  subtitle,
  title,
  firstButton,
  secondButton,
  signUp,
  pathName,
  signIn,
  buttonLabel,
  schema,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const setPayLoad: (v: initialValueType) => AuthData = (
    values: initialValueType
  ) => {
    if (signIn) {
      const payLoad = {
        email: values.email,
        password: values.password,
      };
      return payLoad;
    }
    if (signUp) {
      const payLoad = {
        email: values.email,
        password: values.password,
        name: values.name,
      };
      return payLoad;
    }
    const payLoad = {
      email: values.email,
    };
    return payLoad;
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      keyboardShouldPersistTaps="handled"
    >
      <Image
        source={images.authImage}
        resizeMode="contain"
        style={styles.image}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          const newPayLoad = setPayLoad(values);
          Keyboard.dismiss();
          await submit(newPayLoad);
          setSubmitting(false);
        }}
      >
        {({ handleSubmit, errors, touched, setFieldValue, isSubmitting }) => {
          return (
            <>
              <TextField
                label="Email"
                autoCapitalize="none"
                setFieldValue={setFieldValue}
                fieldName="email"
              />
              {errors.email && touched.email ? (
                <TextFieldError error={errors.email} />
              ) : null}

              {(signUp || signIn) && (
                <>
                  <TextField
                    label="Password"
                    autoCapitalize="none"
                    secureTextEntry={isOpen}
                    showPasswords={() => setIsOpen((prev) => !prev)}
                    isOpen={isOpen}
                    setFieldValue={setFieldValue}
                    fieldName="password"
                  />
                  {errors.password && touched.password ? (
                    <TextFieldError error={errors.password} />
                  ) : null}
                </>
              )}

              {signUp && (
                <>
                  <TextField
                    label="Full Name"
                    autoCapitalize="none"
                    setFieldValue={setFieldValue}
                    fieldName="name"
                  />
                  {errors.name && touched.name ? (
                    <TextFieldError error={errors.name} />
                  ) : null}
                </>
              )}

              <Button
                label={buttonLabel}
                onPress={handleSubmit}
                disabled={isSubmitting}
              />
            </>
          );
        }}
      </Formik>
      <View style={styles.divider} />
      <View style={styles.footer}>
        <Link href={{ pathname: `/(auth)/forgotPassord` }}>{firstButton}</Link>
        <Link href={{ pathname: `/(auth)/${pathName}` }}>{secondButton}</Link>
      </View>
    </ScrollView>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: height * 0.05,
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.75,
    height: height * 0.4,
  },
  title: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 20,
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: height * 0.025,
  },
  divider: {
    height: 2,
    backgroundColor: "grey",
    width: width * 0.6,
    borderRadius: 5,
    marginVertical: height * 0.02,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: height * 0.02,
  },
});
