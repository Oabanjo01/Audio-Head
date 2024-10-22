import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { CategoryIconName } from "root/constants/icons/icon";

export const TabBarIcon = ({
  color,
  iconName,
  focused,
}: {
  color: string;
  iconName: CategoryIconName;
  focused: boolean;
}) => {
  //   const scaleAnim = useRef(new Animated.Value(1)).current;

  //   useEffect(() => {
  //     scaleAnim.setValue(1);

  //     // Create animation sequence
  //     Animated.sequence([
  //       Animated.timing(scaleAnim, {
  //         toValue: 1.2,
  //         duration: 150,
  //         easing: Easing.bounce,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(scaleAnim, {
  //         toValue: 1,
  //         duration: 150,
  //         easing: Easing.bounce,
  //         useNativeDriver: true,
  //       }),
  //     ]).start();

  //     setPrev(!focused);
  //   }, [prev]);

  return (
    <View>
      <FontAwesome name={iconName as any} size={24} color={color} />
    </View>
  );
};
