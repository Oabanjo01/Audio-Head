import { FormikErrors } from "formik";
import React, { FC, useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { Colors } from "root/constants/Colors";
import { fontSize, width } from "root/constants/Dimensions";

interface TextFieldProps extends TextInputProps {
  label: string;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<any>>;
}

export const TextField: FC<TextFieldProps> = ({
  setFieldValue,
  label,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [texts, setText] = useState("");
  return (
    <View style={{ width: "100%", marginBottom: 5 }}>
      <TextInput
        placeholder={label}
        onChangeText={(text) => {
          setText(() => {
            return text;
          });
          setFieldValue(label.toLowerCase(), text, true);
        }}
        value={texts}
        style={[
          styles.input,
          isFocused ? styles.activeBorder : styles.inActiveBorder,
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
};

export default TextField;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    fontSize: fontSize.medium,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: width * 0.03,
    width: width * 0.9,
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
