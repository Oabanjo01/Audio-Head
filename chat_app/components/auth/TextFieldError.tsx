import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { Colors } from "root/constants/Colors";

interface TextFieldErrorProps extends TextProps {
  error: string;
}

const TextFieldError: React.FC<TextFieldErrorProps> = ({ error, ...props }) => {
  return (
    <Text
      style={{
        color: Colors.light.redColor,
        alignSelf: "flex-start",
        marginBottom: 5,
        marginLeft: 5,
      }}
      {...props}
    >
      {error}
    </Text>
  );
};

export default TextFieldError;

const styles = StyleSheet.create({});
