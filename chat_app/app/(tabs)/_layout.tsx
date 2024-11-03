import { useKeyboard } from "@react-native-community/hooks";
import { Tabs } from "expo-router";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { MyTabBar } from "root/components/tabBar/customTabBar";
import { Colors } from "root/constants/colors/Colors";
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
        }}
        tabBar={(props) => <MyTabBar {...props} />}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="addProducts"
          options={{
            title: "Add",
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
          }}
        />
      </Tabs>
      {/* <Tabs
        backBehavior="firstRoute"
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: Colors.light.primary,
          tabBarStyle: [
            styles.tabBarStyle,
            {
              bottom: Platform.select({
                android: keyboard.keyboardShown ? -100 : height * 0.02,
                // ios: keyboard.keyboardShown ? -100 : height * 0.025,
                ios: 0,
              }),
            },
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
            tabBarLabelStyle: {
              marginBottom: 20,
              color: Colors.light.primary,
            },
            tabBarIcon: ({ color, focused, size }) =>
              Platform.select({
                android: (
                  <LinearGradient
                    colors={["transparent", "white"]}
                    // locations={Platform.select({
                    //   android: [0.5, 0.5],
                    //   ios: [0.5, 0.5],
                    // })}
                    locations={[0.5, 0.5]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{
                      height: width * 0.23,
                      width: width * 0.23,
                      alignItems: "center",
                      borderRadius: (width * 0.23) / 2,
                      justifyContent: "center",
                      marginBottom: height * 0.085,
                      // marginBottom: Platform.select({
                      //   android: height * 0.085,
                      //   ios: height * 0.085,
                      // }),
                    }}
                  >
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
                  </LinearGradient>
                ),
                ios: (
                  <View
                    style={[
                      styles.middleIconTabbarStyle,
                      {
                        backgroundColor: focused ? color : "white",
                        marginBottom: height * 0.085,
                      },
                    ]}
                  >
                    <IconComponent
                      size={32}
                      name="add"
                      color={focused ? "white" : Colors.light.primary}
                    />
                  </View>
                ),
              }),
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
      </Tabs> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: height * 0.085,
    paddingBottom: height * 0.01,
    paddingTop: height * 0.01,
    borderWidth: 1,
    borderColor: Platform.select({
      android: Colors.light.primary,
      ios: "none",
    }),
    shadowColor: Colors.light.primary,
    backgroundColor: Colors.light.lightestGrey,
    shadowOpacity: 0.3,
    shadowOffset: { height: 10, width: 5 },
    shadowRadius: 10,
    elevation: 5,
    position: "absolute",
    marginHorizontal: Platform.select({
      android: 10,
      ios: 0,
    }),
    borderRadius: Platform.select({
      android: 15,
      ios: 0,
    }),
  },
  middleIconTabbarStyle: {
    height: width * 0.17,
    borderRadius: (width * 0.17) / 2,
    width: width * 0.17,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowOffset: { height: 10, width: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
});
