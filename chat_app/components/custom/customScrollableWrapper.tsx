import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import AuthenticationBackground from "root/assets/svg/AuthenticationBackground.svg";
import { IconName } from "root/components/auth/TextField";
import { Colors } from "root/constants/colors/Colors";
import { height, width } from "root/constants/Dimensions";
import images from "root/constants/Images";
import { useAuthentication } from "root/utils/hooks/auth/useAuthentication";

import DropDownMenu, { DropDownRefProps } from "../dropDownMenu";
import CustomText from "./customText";
import { layOutStyles } from "./customUnScrollableWrapper";

export interface KeyboardAvoidingViewProps {
  leftHeaderIcon?: boolean;
  children: JSX.Element;
  title?: string;
  rightHeaderIcon?: boolean;
  rightHeaderIconTitle?: IconName;
  onPress?(): void;
  dropdown?: boolean;
  productData?: any;
  showBackgroundImage?: boolean;
  showAppIcon?: boolean;
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
  showBackgroundImage = false,
  showAppIcon = false,
}) => {
  const { signOut } = useAuthentication();

  const dropdownRef = useRef<DropDownRefProps>(null);

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={0}
      style={layOutStyles.keyboardAvoidingView}
    >
      {showBackgroundImage && (
        <AuthenticationBackground
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          width={width}
          height={height}
        />
      )}
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {showAppIcon && <Image source={images.appIcon} />}
              <CustomText style={layOutStyles.titleStyle}>
                {"  "}
                {title}
              </CustomText>
            </View>
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
