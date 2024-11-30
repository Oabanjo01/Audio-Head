import React from "react";
import { Text, TextProps } from "react-native";
import { Colors } from "root/constants/colors/Colors";
import { fonts } from "src/_layout";

type CustomTextProps = TextProps & {
  fontFamily?: string;
  fontSize?: number;
  color?: string;
};

const CustomText: React.FC<CustomTextProps> = ({
  style,
  fontFamily = fonts.DM_Sans_Regular,
  fontSize = 16,
  color = Colors.light.text,
  ...props
}) => {
  return <Text {...props} style={[{ fontFamily, fontSize, color }, style]} />;
};

export default CustomText;
