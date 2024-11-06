import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "root/constants/colors/Colors";
import { width } from "root/constants/Dimensions";

import TabbarItem from "./tabbarItem";

export function MyTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const buttonWidth = dimension.width / state.routes.length;

  const activeTabItemBackgroundPosition = useSharedValue(0);

  const activeTabBarItemStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: activeTabItemBackgroundPosition.value,
        },
      ],
    };
  });

  const onTabBarLayout = (e: LayoutChangeEvent) => {
    setDimension({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };
  return (
    <View onLayout={onTabBarLayout} style={styles.tabbarStyle}>
      <Animated.View
        style={[
          activeTabBarItemStyle,
          {
            position: "absolute",
            backgroundColor: Colors.light.primary,
            borderRadius: 30,
            marginHorizontal: 10 / 2,
            height: dimension.height - 10,
            width: buttonWidth - 10,
          },
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          activeTabItemBackgroundPosition.value = withSpring(
            buttonWidth * index,
            {
              duration: 1000,
            }
          );
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabbarItem
            key={route.name}
            routeName={route.name}
            isFocused={isFocused}
            options={options}
            onPress={onPress}
            onLongPress={onLongPress}
            label={label as string}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbarStyle: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    width: width * 0.8,
    backgroundColor: "white",
    bottom: 25,
    justifyContent: "space-between",
    borderRadius: 30,
    // marginHorizontal: width * 0.1,
    elevation: 10,
    shadowColor: Colors.light.primary,
    // gap: 5,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    paddingVertical: 10,
    shadowRadius: 10,
  },
  //   gradient: {
  //     flexDirection: "row",
  //     backgroundColor: Colors.light.primary,
  //   },
});
