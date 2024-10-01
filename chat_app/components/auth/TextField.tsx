import React, { FC } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { fontSize, width } from "root/constants/Dimensions";

interface TextFieldProps {
  label: string;
}

export const TextField: FC<TextFieldProps> = ({ label }) => {
  return (
    <View style={{ width: "100%", marginBottom: 10 }}>
      <KeyboardAvoidingView></KeyboardAvoidingView>
      <TextInput
        placeholder={label}
        style={{
          borderWidth: 1,
          fontSize: fontSize.medium,
          borderRadius: 10,
          paddingVertical: 5,
          paddingHorizontal: width * 0.03,
          width: width * 0.9,
          alignSelf: "center",
        }}
      />
    </View>
  );
};

export default TextField;

const styles = StyleSheet.create({});
