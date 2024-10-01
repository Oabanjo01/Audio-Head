import { Dimensions } from "react-native";

import { FontSize, FontWeight } from "./types/Sizes";

export const fontSize: FontSize = {
  small: 12,
  medium: 14,
  large: 16,
  extraLarge: 18,
};

export const fontWeight: FontWeight = {
  light: "300",
  medium: "400",
  bold: "600",
  veryBold: "800",
} as const;

export const { height, width } = Dimensions.get("window");

const styles = {
  fontSize,
  fontWeight,
  width,
  height,
};

export default styles;
