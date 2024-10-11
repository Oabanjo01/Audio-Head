import Ionicons from "@expo/vector-icons/Ionicons";
import { FormikErrors } from "formik";
import React, { ComponentProps, FC, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { Colors } from "root/constants/Colors";
import { fontSize, width } from "root/constants/Dimensions";

import TextFieldError from "./TextFieldError";

const textWidth = width * 0.9;

export type IconName = ComponentProps<typeof Ionicons>["name"];

interface TextFieldProps extends TextInputProps {
  label: string;
  fieldName: string;
  showPasswords?: () => void;
  isOpen?: boolean;
  leftIconTitle?: IconName;
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<any>>;
  leftIcon?: boolean;
  viewProps?: ViewStyle;
  error?: boolean;
  errorMessage?: string;
  price?: boolean;
  handleChange?:
    | {
        (e: React.ChangeEvent<any>): void;
        <T = string | React.ChangeEvent<any>>(
          field: T
        ): T extends React.ChangeEvent<any>
          ? void
          : (e: string | React.ChangeEvent<any>) => void;
      }
    | any;
}

export const TextField: FC<TextFieldProps> = ({
  setFieldValue,
  label,
  fieldName,
  showPasswords,
  isOpen = false,
  leftIcon = false,
  leftIconTitle,
  viewProps,
  error,
  errorMessage,
  price,
  handleChange,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [texts, setText] = useState("");

  return (
    <>
      <View
        style={[
          styles.input,
          isFocused ? styles.activeBorder : styles.inActiveBorder,
          {
            marginBottom: 5,
            width: width * 0.9,
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "flex-start",
            ...viewProps,
          },
        ]}
      >
        <View
          style={{
            justifyContent: "flex-start",
            flexDirection: "row",
            width: "90%",
          }}
        >
          {leftIcon && (
            <Ionicons
              onPress={showPasswords}
              name={leftIconTitle}
              size={24}
              style={{
                alignSelf: "center",
                marginRight: 15,
              }}
              color="black"
            />
          )}
          <TextInput
            placeholder={label}
            cursorColor={"black"}
            selectionColor={Colors.light.primary}
            onChangeText={(text) => {
              if (price) {
                const numbersOnly = text.replaceAll(/[^\d.]/g, "");
                console.log(numbersOnly, "Number");
                setText(numbersOnly);
                setFieldValue("price", numbersOnly, true);
              } else {
                setText(text);
                setFieldValue(fieldName, text, true);
              }
            }}
            value={texts}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </View>
        {label === "Password" && (
          <Ionicons
            onPress={showPasswords}
            name={isOpen ? "eye" : "eye-off"}
            size={24}
            style={{
              alignSelf: "center",
            }}
            color="black"
          />
        )}
      </View>
      {error ? <TextFieldError error={errorMessage || ""} /> : null}
    </>
  );
};

export default TextField;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    fontSize: fontSize.medium,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: width * 0.03,
    width: textWidth * 0.9,
    alignSelf: "center",
  },
  activeBorder: {
    borderColor: Colors.light.text,
    borderWidth: 1.5,
  },
  inActiveBorder: {
    borderColor: Colors.light.lightGrey,
    borderWidth: 1,
  },
});
