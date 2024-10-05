import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { Colors } from "root/constants/Colors";
import { height, width } from "root/constants/Dimensions";

interface ButtonProps {
  label: string;
  disabled?: boolean;
  onPress?: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onPress, disabled }) => {
  return (
    <Pressable
      onPress={disabled ? null : onPress}
      style={{
        ...styles.buttonStyle,
        backgroundColor: disabled ? Colors.light.lightGrey : Colors.light.text,
      }}
    >
      <Text style={[styles.innerTextStyle]}>{label}</Text>
      {disabled && <ActivityIndicator color={Colors.light.redColor} />}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  buttonStyle: {
    width: width * 0.9,
    marginTop: 5,
    marginBottom: height * 0.075,
    paddingVertical: 10,
    borderRadius: 5,
  },
  innerTextStyle: { color: "white", alignSelf: "center" },
});
