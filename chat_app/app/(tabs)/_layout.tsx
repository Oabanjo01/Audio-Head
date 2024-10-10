import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Colors } from "root/constants/Colors";
import { height } from "root/constants/Dimensions";

export default function TabLayout() {
  console.log("================================");
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "blue",
        tabBarStyle: {
          height: height * 0.075,
          paddingBottom: height * 0.01,
          borderWidth: 1,
          borderColor: Colors.light.text,
          paddingTop: height * 0.01,
          marginBottom: 20,
          marginHorizontal: 10,
          borderRadius: 10,
          elevation: 1,
        },
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
        name="search"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused, size }) => (
            <FontAwesome size={28} name="cog" color={color} />
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
  );
}
