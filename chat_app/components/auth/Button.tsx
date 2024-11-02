import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { Colors } from "root/constants/Colors";
import { height, width } from "root/constants/Dimensions";

interface ButtonProps extends PressableProps {
  label: string;
  // loveeeee this
  onPress?(): void;
  buttonStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  submitting?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  buttonStyle,
  disabled,
  submitting,
  ...props
}) => {
  return (
    <Pressable
      onPress={disabled ? null : onPress}
      style={[
        styles.buttonStyle,
        buttonStyle,
        disabled && styles.disabledButton,
      ]}
      {...props}
    >
      <Text style={[styles.innerTextStyle]}>{label}</Text>
      {disabled === true && submitting ? (
        <ActivityIndicator color={Colors.light.background} />
      ) : null}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  buttonStyle: {
    width: width * 0.9,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: height * 0.025,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary,
  },
  disabledButton: {
    backgroundColor: Colors.light.lightGrey,
  },
  innerTextStyle: { color: "white", alignSelf: "center", marginRight: 10 },
});
