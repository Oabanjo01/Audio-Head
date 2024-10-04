import Ionicons from "@expo/vector-icons/Ionicons";
import { FormikErrors } from "formik";
import React, { FC, useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { Colors } from "root/constants/Colors";
import { fontSize, width } from "root/constants/Dimensions";

const textWidth = width * 0.9;

interface TextFieldProps extends TextInputProps {
  label: string;
  fieldName: string;
  showPasswords?: () => void;
  isOpen?: boolean;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<any>>;
}

export const TextField: FC<TextFieldProps> = ({
  setFieldValue,
  label,
  fieldName,
  showPasswords,
  isOpen = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [texts, setText] = useState("");

  return (
    <View
      style={[
        styles.input,
        isFocused ? styles.activeBorder : styles.inActiveBorder,
        {
          width: "100%",
          marginBottom: 5,
          flexDirection: "row",
          justifyContent: "space-between",
        },
      ]}
    >
      <TextInput
        placeholder={label}
        cursorColor={"black"}
        onChangeText={(text) => {
          setText(text);
          setFieldValue(fieldName, text, true);
        }}
        value={texts}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
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
