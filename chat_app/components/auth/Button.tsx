import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { height, width } from "root/constants/Dimensions";

interface ButtonProps {
  label: string;
  backgroundColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  backgroundColor = "black",
  label,
}) => {
  return (
    <Pressable
      onPress={() => console.log("Login")}
      style={{
        width: width * 0.9,
        marginTop: 5,
        marginBottom: height * 0.075,
        backgroundColor,
        paddingVertical: 10,
        borderRadius: 5,
      }}
    >
      <Text style={{ color: "white", alignSelf: "center" }}>{label}</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({});
