import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { IconName } from "root/components/auth/TextField";
import { Colors } from "root/constants/Colors";
import { height, width } from "root/constants/Dimensions";
import { useAuthentication } from "root/utils/hooks/auth/useAuthentication";

export interface KeyboardAvoidingViewProps {
  leftHeaderIcon?: boolean;
  children: JSX.Element;
  title?: string;
  rightHeaderIcon?: boolean;
  rightHeaderIconTitle?: IconName;
  onPress?(): void;
}

const CustomWrapper: React.FC<KeyboardAvoidingViewProps> = ({
  children,
  title,
  rightHeaderIcon,
  rightHeaderIconTitle,
  leftHeaderIcon,
  onPress,
}) => {
  const { signOut } = useAuthentication();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        style={{ width: "100%" }}
      >
        {title && (
          <View
            style={{
              width,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              {leftHeaderIcon && (
                <View
                  style={{
                    borderRadius: width * 0.07,
                    borderColor: Colors.light.primary,
                    height: width * 0.125,
                    width: width * 0.125,
                    marginLeft: 10,
                    borderWidth: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name={"arrow-back"}
                    color={Colors.light.primary}
                    size={width * 0.08}
                    onPress={async () => {
                      router.back();
                    }}
                  />
                </View>
              )}
            </View>

            <Text
              style={{
                flex: 2,
                textAlign: "center",
                color: Colors.light.text,
                fontSize: 20,
                fontWeight: "600",
              }}
            >
              {title}
            </Text>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              {rightHeaderIcon && (
                <View
                  style={{
                    borderRadius: width * 0.07,
                    borderColor: Colors.light.primary,
                    height: width * 0.125,
                    width: width * 0.125,
                    marginRight: 10,
                    borderWidth: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name={rightHeaderIconTitle}
                    color={Colors.light.primary}
                    size={width * 0.08}
                    onPress={async () => {
                      onPress ? onPress() : null;
                    }}
                  />
                </View>
              )}
            </View>
          </View>
        )}
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: height * 0.025,
  },
});

export default CustomWrapper;
