import { LinearGradient } from "expo-linear-gradient";
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
import { Colors } from "root/constants/colors/Colors";
import {
  DEFAULT_GRADIENT_COLORS,
  DEFAULT_GRADIENT_LOCATIONS,
} from "root/constants/colors/gradientColors";
import { height, width } from "root/constants/Dimensions";

interface ShinyButtonProps extends PressableProps {
  label: string;
  onPress?(): void;
  buttonStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  submitting?: boolean;
  gradientColors?: string[];
  gradientLocations?: number[];
}

const ShinyPurpleButton: React.FC<ShinyButtonProps> = ({
  label,
  onPress,
  buttonStyle,
  disabled,
  submitting,
  gradientColors = DEFAULT_GRADIENT_COLORS,
  gradientLocations = DEFAULT_GRADIENT_LOCATIONS,
  ...props
}) => {
  const gradientProps = {
    colors: disabled
      ? [
          Colors.light.lightGrey,
          Colors.light.lightGrey,
          Colors.light.lightGrey,
          Colors.light.lightGrey,
        ]
      : gradientColors,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    locations: gradientLocations,
  };

  return (
    <Pressable
      onPress={disabled ? null : onPress}
      style={({ pressed }) => [
        { opacity: pressed && !disabled ? 0.9 : 1 },
        buttonStyle,
      ]}
      {...props}
    >
      <LinearGradient
        {...gradientProps}
        style={[
          styles.gradient,
          !disabled && {
            borderWidth: 1,
            borderColor: Colors.light.primary,
          },
        ]}
      >
        <Text style={[styles.innerTextStyle]}>{label}</Text>
        {disabled === true && submitting ? (
          <ActivityIndicator color={Colors.light.background} />
        ) : null}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  gradient: {
    width: width * 0.9,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 15,
    marginBottom: height * 0.025,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    alignItems: "center",
    elevation: 7,
    shadowColor: Colors.light.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  innerTextStyle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default ShinyPurpleButton;
