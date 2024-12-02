import { Href, Link } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import IconComponent from "root/components/custom/customIcon";
import CustomWrapper from "root/components/custom/customScrollableWrapper";
import { Colors } from "root/constants/colors/Colors";
import { width } from "root/constants/Dimensions";
import { CategoryIconName } from "root/constants/icons/icon";
import { UserData } from "root/constants/types/authTypes";
import { getAuthState } from "root/redux/slices/authSlice";
import { useAppSelector } from "root/redux/store";

type Route = Href<string | { pathname: string; params?: Record<string, any> }>;

type profileListDataType = {
  title: string;
  route?: Route;
  icon: CategoryIconName;
};

export default function Profile() {
  const { userData } = useAppSelector(getAuthState);
  const { email, name, avatar } = userData as UserData;

  const profileListData: profileListDataType[] = [
    {
      title: "Edit profile",
      route: "/(screens)/(profile)/editProfile",
      icon: "edit",
    },
    {
      title: "Messages",
      icon: "messenger-outline",
    },
    {
      title: "Theme",
      icon: "sunny-outline",
    },
    {
      title: "Your Products",
      route: "/(screens)/(profile)/userProducts",
      icon: "shelves",
    },
    {
      title: "Log Out",
      icon: "log-out-outline",
    },
  ];

  return (
    <CustomWrapper
      title="Profile"
      rightHeaderIcon
      rightHeaderIconTitle="log-out"
    >
      <>
        <View
          style={{
            width: width,
            marginBottom: 20,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <View style={styles.detailViewStyle}>
            {avatar ? (
              <Image source={{ uri: avatar }} height={50} width={50} />
            ) : (
              <IconComponent
                name={"person"}
                size={50}
                style={
                  {
                    // height: 75,
                    // width: 75,
                    // backgroundColor: "orange",
                  }
                }
              />
            )}
          </View>
          <View style={{ alignSelf: "center" }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                color: Colors.light.primary,
                fontWeight: "600",
                marginBottom: 5,
              }}
            >
              {name}
            </Text>
            <Text style={{ textAlign: "center", fontSize: 16 }}>{email}</Text>
          </View>
        </View>

        {profileListData.map((item, index) => {
          const { icon, title, route } = item;
          return (
            <Link
              key={index}
              href={{
                pathname: (route as any) || "/(tabs)/profile",
                params: {
                  title: title,
                },
              }}
              asChild
              style={[
                styles.optionsViewStyle,
                index < profileListData.length - 1
                  ? {
                      borderBottomWidth: 1,
                      borderBottomColor: "black",
                    }
                  : {},
              ]}
            >
              <Pressable>
                <IconComponent
                  name={icon}
                  style={{ marginLeft: 20, marginRight: 10 }}
                />
                <Text style={{ fontSize: 16 }}>{title}</Text>
              </Pressable>
            </Link>
          );
        })}
      </>
    </CustomWrapper>
  );
}

const styles = StyleSheet.create({
  detailViewStyle: {
    borderWidth: 1,
    marginBottom: 10,
    borderColor: "black",
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
  },
  optionsViewStyle: {
    marginBottom: 5,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    width: width * 0.8,
    paddingVertical: 20,
  },
});
