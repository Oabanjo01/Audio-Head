import { Link } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Colors } from "root/constants/colors/Colors";
import { height, width } from "root/constants/Dimensions";
import images, { ImageType } from "root/constants/Images";
import Fonts from "root/constants/types/fontTypes";
import { AuthData } from "root/controllers/auth/auth";
import {
  ForgotPasswordSchemaType,
  SignInSchemaType,
  SignUpSchemaType,
} from "root/utils/validations";
import { ObjectSchema } from "yup";

import IconComponent from "../custom/customIcon";
import CustomText from "../custom/customText";
import Button from "./Button";
import TextField from "./TextField";
import TextFieldError from "./TextFieldError";

const signInProviders: Pick<ImageType, "google" | "facebook" | "apple"> = {
  google: images.google,
  facebook: images.facebook,
  apple: images.apple,
};

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
  pathName: "signUp" | "";
  signUp?: boolean;
  signIn?: boolean;
  buttonLabel: string;
  schema: ObjectSchema<SchemaType>;
}

const AuthLayout: React.FC<AuthLayoutProp> = ({
  initialValues,
  submit,
  firstButton,
  secondButton,
  signUp,
  pathName,
  signIn,
  buttonLabel,
  schema,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

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

  const fieldProps = {
    paddingVertical: 15,
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={{
          marginTop: height * 0.1,
          alignItems: "center",
        }}
      >
        <CustomText
          fontFamily={Fonts.DM_Sans_Bold}
          fontSize={51.25}
          style={{ color: "white" }}
        >
          Audio
        </CustomText>
        <CustomText fontFamily={Fonts.DM_Sans_Bold} fontSize={14} color="white">
          It's modular and designed to last
        </CustomText>

        <View
          style={{
            marginTop: height * 0.3,
          }}
        >
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
            {({
              handleSubmit,
              errors,
              touched,
              setFieldValue,
              isSubmitting,
            }) => {
              return (
                <>
                  <TextField
                    label="Email"
                    viewProps={{
                      backgroundColor: "white",
                      marginBottom:
                        errors.password && touched.password ? 5 : 15,
                      ...fieldProps,
                    }}
                    leftIcon
                    leftIconTitle="email"
                    leftIconColor="grey"
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
                        leftIcon
                        leftIconTitle="password"
                        viewProps={{
                          backgroundColor: "white",
                          marginBottom:
                            errors.password && touched.password ? 5 : 15,
                          ...fieldProps,
                        }}
                        leftIconColor="grey"
                        rightIconColor="grey"
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
                        leftIcon
                        leftIconTitle="person-pin"
                        viewProps={{
                          backgroundColor: "white",
                          marginBottom:
                            errors.password && touched.password ? 5 : 15,
                          ...fieldProps,
                        }}
                        leftIconColor="grey"
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
                  {signIn && (
                    <View
                      style={{
                        width: "100%",
                        alignSelf: "flex-end",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginVertical: 10,
                      }}
                    >
                      <Link href={{ pathname: `/(auth)/forgotPassord` }}>
                        <CustomText
                          fontSize={14}
                          color="white"
                          fontFamily={Fonts.DM_Sans_Bold}
                        >
                          {signIn || signUp ? firstButton : ""}
                          {/* Forgot Password */}
                        </CustomText>
                      </Link>
                      <View
                        style={{
                          alignSelf: "flex-end",
                          alignItems: "center",
                          flexDirection: "row-reverse",
                        }}
                      >
                        <IconComponent
                          name={
                            isChecked ? "check-box" : "check-box-outline-blank"
                          }
                          onPress={() => setIsChecked((prev) => !prev)}
                          style={{
                            marginLeft: 5,
                          }}
                        />
                        <CustomText
                          fontSize={14}
                          fontFamily={Fonts.DM_Sans_Bold}
                          color="white"
                        >
                          Remember me
                        </CustomText>
                      </View>
                    </View>
                  )}

                  <Button
                    label={buttonLabel}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: Colors.light.primary,
                      paddingVertical: 15,
                      borderRadius: 10,
                    }}
                  />

                  {signIn && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginTop: 20,
                      }}
                    >
                      {Object.entries(signInProviders).map(
                        ([provider, image], index) => {
                          return (
                            <Pressable
                              key={provider}
                              style={{
                                backgroundColor: "white",
                                alignSelf: "center",
                                borderRadius: 9.4,
                                height: 50,
                                width: 50,
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight:
                                  index <
                                  Object.entries(signInProviders).length - 1
                                    ? 10
                                    : 0,
                              }}
                              onPress={() => {
                                console.log(`use ${provider} to sign in`);
                              }}
                            >
                              <Image
                                source={image}
                                style={{
                                  alignSelf: "center",
                                  height: 25,
                                  width: 25,
                                }}
                                resizeMode="contain"
                              />
                            </Pressable>
                          );
                        }
                      )}
                    </View>
                  )}

                  <View
                    style={{
                      marginTop: 24,
                      alignItems: "center",
                    }}
                  >
                    <CustomText
                      color="white"
                      fontSize={14}
                      style={{
                        textAlignVertical: "center",
                      }}
                    >
                      Didn’t have any account?{"  "}
                      <Link href={{ pathname: `/(auth)/${pathName}` }}>
                        <CustomText
                          fontFamily={Fonts.DM_Sans_Bold}
                          fontSize={14}
                          color={Colors.light.primary}
                          style={{
                            textDecorationLine: "underline",
                            textDecorationColor: Colors.light.primary,
                            textDecorationStyle: "solid",
                          }}
                        >
                          {secondButton}
                        </CustomText>
                      </Link>
                    </CustomText>
                  </View>
                </>
              );
            }}
          </Formik>
        </View>
      </View>
    </ScrollView>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    width: width,
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
