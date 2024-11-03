import React from "react";
import { Text, View } from "react-native";
import Toast, { ToastPosition } from "react-native-toast-message";
import { Colors } from "root/constants/colors/Colors";
import { width } from "root/constants/Dimensions";

interface ToastProps {
  text1: string;
  text2: string;
  type: "success" | "info" | "error";
  position?: ToastPosition;
}

export const toastConfig = {
  success: ({ props }: { props: ToastProps }) =>
    customToasts({ props: props, backgroundColor: Colors.light.greenColor }),
  error: ({ props }: { props: ToastProps }) =>
    customToasts({
      props: props,
      backgroundColor: Colors.light.errorClor,
    }),

  info: ({ props }: { props: ToastProps }) =>
    customToasts({ props: props, backgroundColor: Colors.light.blueColor }),
};

const customToasts = ({
  backgroundColor,
  props,
}: {
  backgroundColor: string;
  props: ToastProps;
}) => {
  return (
    <View
      style={{
        padding: 15,
        width: width * 0.8,
        backgroundColor: backgroundColor,
        opacity: 0.8,
        borderRadius: 15,
      }}
    >
      <Text
        style={{
          color: Colors.light.background,
          fontWeight: "600",
          fontSize: 18,
        }}
      >
        {props.text1}
      </Text>
      <Text
        style={{
          color: Colors.light.background,
          fontWeight: "400",
          fontSize: 14,
        }}
      >
        {props.text2}
      </Text>
    </View>
  );
};

export const showToast = ({ type, text1, text2, position }: ToastProps) => {
  Toast.hide();
  Toast.show({
    type: type,
    props: { text1: text1, text2: text2 },
    position: position || "bottom",
    visibilityTime: 5000,
    bottomOffset: 20,
    text1: text1,
    text2: text2,
  });
};
