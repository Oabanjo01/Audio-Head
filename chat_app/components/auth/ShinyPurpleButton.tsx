import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import React from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

interface ShinyPurpleButtonProps extends Omit<PressableProps, "style"> {
  onPress: () => void;
  title: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  gradientColors?: string[];
  gradientLocations?: number[];
}

const DEFAULT_GRADIENT_COLORS = [
  "#FFFFFF",
  "#A7A0E8",
  "#6A5ACD",
  "#483D8B",
] as const;

const DEFAULT_GRADIENT_LOCATIONS = [0, 0.3, 0.6, 1] as const;

const ShinyPurpleButton: React.FC<ShinyPurpleButtonProps> = ({
  onPress,
  title,
  style,
  textStyle,
  gradientColors = DEFAULT_GRADIENT_COLORS,
  gradientLocations = DEFAULT_GRADIENT_LOCATIONS,
  ...pressableProps
}) => {
  // Define gradient props with correct typing
  const gradientProps: LinearGradientProps = {
    colors: gradientColors,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    locations: gradientLocations,
    style: styles.gradient,
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonContainer,
        { opacity: pressed ? 0.9 : 1 },
        style,
      ]}
      {...pressableProps}
    >
      <LinearGradient {...gradientProps}>
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 25,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#6A5ACD",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default ShinyPurpleButton;
