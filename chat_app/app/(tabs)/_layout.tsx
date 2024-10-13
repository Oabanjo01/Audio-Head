import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { Colors } from "root/constants/Colors";
import { height } from "root/constants/Dimensions";

export default function TabLayout() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -64} // Adjust this value as needed
    >
      <Tabs
        backBehavior="firstRoute"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.light.primary,
          tabBarStyle: styles.tabBarStyle,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="addProducts"
          options={{
            title: "New",
            tabBarIcon: ({ color, focused, size }) => (
              <FontAwesome size={28} name="plus-circle" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="male" color={color} />
            ),
          }}
        />
      </Tabs>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: height * 0.075,
    paddingBottom: height * 0.01,
    borderWidth: 1,
    borderColor: Colors.light.text,
    paddingTop: height * 0.01,
    marginBottom: Platform.OS === "ios" ? height * 0.04 : 20,
    marginHorizontal: 10,
    borderRadius: 14,
    elevation: 1,
  },
});
