import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleProp, TextStyle } from "react-native";
import { Colors } from "root/constants/colors/Colors";
import { CategoryIconName } from "root/constants/icons/icon";

export type IconComponentProps = {
  name: CategoryIconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
  onPress?(): void;
};

const IconComponent: React.FC<IconComponentProps> = ({
  name,
  size = 24,
  color = Colors.light.primary,
  style,
  onPress,
}) => {
  const isIonicons = Object.keys(Ionicons.glyphMap).includes(name);
  const Icon = isIonicons ? Ionicons : MaterialIcons;

  return (
    <Icon
      name={name as any}
      size={size}
      color={color}
      style={style}
      onPress={onPress}
    />
  );
};

export default IconComponent;
