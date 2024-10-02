import { Formik } from "formik";
import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "root/components/auth/Button";
import TextField from "root/components/auth/TextField";
import TextFieldError from "root/components/auth/TextFieldError";
import { height, width } from "root/constants/Dimensions";
import images from "root/constants/Images";
import { toSentenceCase } from "root/utils/toSentenceCase";
import { signUpSchema } from "root/utils/validations";

const LoginScreen = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={images.authImage}
          resizeMode="contain"
          style={styles.image}
        />
        <Text style={styles.title}>Online Marketplace for Used Goods</Text>
        <Text style={styles.subtitle}>
          Buy or sell used goods with trust. Chat directly with sellers,
          ensuring a seamless, authentic experience.
        </Text>
        <Formik
          initialValues={initialValues}
          validationSchema={signUpSchema}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
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
            console.log(!isSubmitting, "===", values.email);
            return (
              <>
                <TextField
                  label="Email"
                  autoCapitalize="none"
                  setFieldValue={setFieldValue}
                />
                {errors.email && touched.email ? (
                  <TextFieldError error={errors.email} />
                ) : null}
                <TextField
                  label="Password"
                  autoCapitalize="none"
                  secureTextEntry
                  setFieldValue={setFieldValue}
                />
                {errors.password && touched.password ? (
                  <TextFieldError error={toSentenceCase(errors.password)} />
                ) : null}
                <Button
                  label="Login"
                  onPress={handleSubmit}
                  disabled={
                    isSubmitting ||
                    !isValid ||
                    values.email === "" ||
                    values.password === ""
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
          <Pressable>
            <Text>Sign Up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "white",
  },
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

export default LoginScreen;
