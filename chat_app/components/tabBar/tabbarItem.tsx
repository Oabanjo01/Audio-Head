import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "root/constants/colors/Colors";
import { toSentenceCase } from "root/utils/toSentenceCase";

import IconComponent from "../customIcon";

const renderIcon: Record<string, React.FC> = {
  home: (props: any) => <IconComponent name="home-outline" {...props} />,
  addProducts: (props: any) => <IconComponent name="add" {...props} />,
  profile: (props: any) => <IconComponent name="male" {...props} />,
};

const TabbarItem = function TabBar({
  routeName,
  isFocused,
  options,
  onPress,
  onLongPress,
  label,
}: {
  routeName: string;
  isFocused: boolean;
  options: BottomTabNavigationOptions;
  onPress: () => void;
  onLongPress: () => void;
  label: string;
}) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : 0,
      {
        duration: 500,
      }
    );
  }, [scale, isFocused]);

  const animatedTextStyle = useAnimatedStyle(() => {
    const textOpacity = interpolate(scale.value, [0, 1], [1, 0]);

    return { opacity: textOpacity };
  });
  const animatedIconStyle = useAnimatedStyle(() => {
    const iconTransform = interpolate(scale.value, [0, 1], [1, 1.3]);
    const topMargin = interpolate(scale.value, [0, 1], [1, 10]);
    return { transform: [{ scale: iconTransform }], top: topMargin };
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={{ flex: 1, alignItems: "center" }}
    >
      <Animated.View style={animatedIconStyle}>
        {renderIcon[routeName]({
          color: isFocused ? "white" : Colors.light.primary,
        })}
      </Animated.View>
      <Animated.Text
        style={[
          {
            color: isFocused ? "white" : Colors.light.primary,
          },
          animatedTextStyle,
        ]}
      >
        {toSentenceCase(label)}
      </Animated.Text>
    </Pressable>
  );
};

export default TabbarItem;

const styles = StyleSheet.create({});
