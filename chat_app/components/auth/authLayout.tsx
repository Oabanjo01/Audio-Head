import { Link } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { height, width } from "root/constants/Dimensions";
import images from "root/constants/Images";
import { signInSchema, signUpSchema } from "root/utils/validations";

import Button from "./Button";
import TextField from "./TextField";
import TextFieldError from "./TextFieldError";

interface AuthLayoutProp {
  title: string;
  subtitle: string;
  initialValues: {
    email: string;
    password?: string;
    fullName?: string;
  };
  submit: () => void;
  secondButton: string;
  signUp?: boolean;
  pathName: "signUp" | "verifyEmail" | "";
}

const AuthLayout: React.FC<AuthLayoutProp> = ({
  initialValues,
  submit,
  subtitle,
  title,
  secondButton,
  signUp,
  pathName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
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
        validationSchema={signUp ? signUpSchema : signInSchema}
        onSubmit={(values, { setSubmitting }) => {
          Keyboard.dismiss();
          submit();
          setSubmitting(false);
        }}
      >
        {({
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
          isSubmitting,
        }) => {
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

              {signUp && (
                <>
                  <TextField
                    label="Full Name"
                    autoCapitalize="none"
                    setFieldValue={setFieldValue}
                    fieldName="fullName"
                  />
                  {errors.fullName && touched.fullName ? (
                    <TextFieldError error={errors.fullName} />
                  ) : null}
                </>
              )}

              <Button
                label={signUp ? "Sign Up" : "Login"}
                onPress={handleSubmit}
                disabled={
                  isSubmitting ||
                  !isValid ||
                  values.email === "" ||
                  values?.password === "" ||
                  values?.fullName === ""
                }
              />
            </>
          );
        }}
      </Formik>
      <View style={styles.divider} />
      <View style={styles.footer}>
        <Pressable>
          <Text>Forgot Password?</Text>
        </Pressable>
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
