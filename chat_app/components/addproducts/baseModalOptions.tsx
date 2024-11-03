import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Colors } from "root/constants/colors/Colors";
import { height, width } from "root/constants/Dimensions";

import IconComponent from "../customIcon";

export interface IconProps {
  name: string;
  library: "Ionicons" | "MaterialIcons";
}

export interface BaseItemProps {
  title: string;
  onPress: () => void;
  icon: IconProps | string;
  color?: string;
  pressableStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const BaseModalOption: React.FC<BaseItemProps> = ({
  icon,
  title,
  color = Colors.light.primary,
  onPress,
  pressableStyle,
  textStyle,
}) => {
  const renderIcon = () => {
    if (typeof icon === "string") {
      return <IconComponent name={icon as any} size={26} color={color} />;
    }

    const Icon = icon.library === "Ionicons" ? Ionicons : MaterialIcons;
    return <Icon name={icon.name as any} size={26} color={color} />;
  };

  return (
    <Pressable style={[styles.itemStyle, pressableStyle]} onPress={onPress}>
      {renderIcon()}
      <Text
        style={[{ marginLeft: 15, fontSize: 16, fontWeight: "500" }, textStyle]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  itemStyle: {
    flexDirection: "row",
    height: height * 0.08,
    alignItems: "center",
    padding: 10,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    width: width * 0.9,
  },
});

export default BaseModalOption;
