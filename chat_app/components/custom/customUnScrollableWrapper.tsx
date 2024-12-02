import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { IconName } from "root/components/auth/TextField";
import { Colors } from "root/constants/colors/Colors";
import { height, width } from "root/constants/Dimensions";

import DropDownMenu from "../dropDownMenu";
import CustomText from "./customText";

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

const CustomUnscrollableWrapper: React.FC<KeyboardAvoidingViewProps> = ({
  children,
  title,
  rightHeaderIcon,
  rightHeaderIconTitle,
  leftHeaderIcon,
  onPress,
  dropdown = false,
  productData,
}) => {
  const dropdownRef = useRef<any>(null);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={layOutStyles.keyboardAvoidingView}
    >
      <View style={{ width: "100%", height: "100%" }}>
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

            <CustomText style={layOutStyles.titleStyle}>{title}</CustomText>
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
      </View>
    </KeyboardAvoidingView>
  );
};

export const layOutStyles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
  },

  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: height * 0.025,
  },
  headerIconStyle: {
    borderRadius: width * 0.07,
    borderColor: Colors.light.primary,
    height: width * 0.125,
    width: width * 0.125,
    marginLeft: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleStyle: {
    textAlign: "center",
    color: Colors.light.text,
    fontSize: 20,
    fontWeight: "600",
  },
  headerLayout: {
    paddingTop: StatusBar.currentHeight! + height * 0.05,
    width,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default CustomUnscrollableWrapper;
