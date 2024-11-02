import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { IconName } from "root/components/auth/TextField";
import { Colors } from "root/constants/Colors";
import { width } from "root/constants/Dimensions";
import { useAuthentication } from "root/utils/hooks/auth/useAuthentication";

import { layOutStyles } from "./customUnScrollableWrapper";
import DropDownMenu, { DropDownRefProps } from "./dropDownMenu";

export interface KeyboardAvoidingViewProps {
  leftHeaderIcon?: boolean;
  children: JSX.Element;
  title?: string;
  rightHeaderIcon?: boolean;
  rightHeaderIconTitle?: IconName;
  onPress?(): void;
  dropdown?: boolean;
  productData?: any;
}

const CustomWrapper: React.FC<KeyboardAvoidingViewProps> = ({
  children,
  title,
  rightHeaderIcon,
  rightHeaderIconTitle,
  leftHeaderIcon,
  onPress,
  dropdown = false,
  productData,
}) => {
  const { signOut } = useAuthentication();

  const dropdownRef = useRef<DropDownRefProps>(null);

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      style={layOutStyles.keyboardAvoidingView}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          layOutStyles.scrollViewContent,
          { flexGrow: 1 },
        ]}
        keyboardShouldPersistTaps="handled"
        // refreshControl={}
        style={{ width: "100%" }}
      >
        {title && (
          <View style={layOutStyles.headerLayout}>
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              {leftHeaderIcon && (
                <Pressable
                  style={layOutStyles.headerIconStyle}
                  onPress={async () => {
                    router.back();
                  }}
                >
                  <Ionicons
                    name={"arrow-back"}
                    color={Colors.light.primary}
                    size={width * 0.08}
                  />
                </Pressable>
              )}
            </View>

            <Text style={layOutStyles.titleStyle}>{title}</Text>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              {rightHeaderIcon && (
                <Pressable
                  onPress={onPress}
                  style={[layOutStyles.headerIconStyle, { marginRight: 10 }]}
                >
                  {dropdown ? (
                    <DropDownMenu ref={dropdownRef} productdata={productData} />
                  ) : (
                    <Ionicons
                      name={rightHeaderIconTitle}
                      color={Colors.light.primary}
                      size={width * 0.08}
                    />
                  )}
                </Pressable>
              )}
            </View>
          </View>
        )}
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CustomWrapper;
