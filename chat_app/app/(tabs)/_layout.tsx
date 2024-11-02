import { useKeyboard } from "@react-native-community/hooks";
import { Tabs } from "expo-router";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { TabBarIcon } from "root/components/animatedTabbarIcon";
import IconComponent from "root/components/customIcon";
import { Colors } from "root/constants/Colors";
import { height, width } from "root/constants/Dimensions";

export default function TabLayout() {
  const keyboard = useKeyboard();

  return (
    <KeyboardAvoidingView
      style={{
        height: "100%",
        backgroundColor: "blue",
      }}
    >
      <Tabs
        backBehavior="firstRoute"
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: Colors.light.primary,
          tabBarStyle: [
            styles.tabBarStyle,
            { bottom: keyboard.keyboardShown ? -100 : height * 0.02 },
          ],
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => {
              return <TabBarIcon color={color} iconName={"home"} focused />;
            },
          }}
        />
        <Tabs.Screen
          name="addProducts"
          options={{
            tabBarLabelStyle: { marginBottom: 20, color: Colors.light.primary },
            tabBarIcon: ({ color, focused, size }) => (
              <View
                style={[
                  styles.middleIconTabbarStyle,
                  { backgroundColor: focused ? color : "white" },
                ]}
              >
                <IconComponent
                  size={32}
                  name="add"
                  color={focused ? "white" : Colors.light.primary}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon color={color} iconName={"male"} focused />
            ),
          }}
        />
      </Tabs>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: height * 0.085,
    paddingBottom: height * 0.01,
    paddingTop: height * 0.01,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    shadowColor: "black",
    backgroundColor: Colors.light.lightestGrey,
    opacity: 0.9,
    shadowOpacity: 0.3,
    shadowOffset: { height: 10, width: 5 },
    shadowRadius: 10,
    elevation: 5,
    position: "absolute",
    // bottom: Platform.select({
    //   android: height * 0.02,
    //   ios: height * 0.05,
    // }),
    marginHorizontal: 10,
    borderRadius: 14,
  },
  middleIconTabbarStyle: {
    height: width * 0.17,
    borderRadius: (width * 0.17) / 2,
    width: width * 0.17,

    marginBottom: (height * 0.075) / 2,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
