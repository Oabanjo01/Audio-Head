import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform, StatusBar, View } from "react-native";
import Toast from "react-native-toast-message";
import Loader from "root/components/customLoader";
import { toastConfig } from "root/components/toast";
import { height } from "root/constants/Dimensions";
import { ProfileResponse } from "root/constants/types/authTypes";
import { authService } from "root/controllers/auth/auth";
import { getAuthState, loading, login } from "root/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "root/redux/store";

export const AuthProvider = () => {
  const { loading: isLoading, userData } = useAppSelector(getAuthState);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const fetchItems = async () => {
    dispatch(loading(true));
    try {
      const response = await authService<any, "profile">({
        endPoint: "profile",
        method: "GET",
      });
      if (!response) return;
      const { data } = response;

      const { profile } = data as ProfileResponse;

      if (profile) {
        console.log("Gote hereeee");
        router.replace("/(tabs)/home");
        dispatch(login(profile));
      }
    } finally {
      dispatch(loading(false));
    }
  };
  useEffect(() => {
    fetchItems();
  }, []);
  return (
    <>
      <View
        style={{
          paddingTop:
            Platform.OS === "ios" ? height * 0.055 : StatusBar.currentHeight,
          backgroundColor: "transparent",
        }}
      >
        <StatusBar
          networkActivityIndicatorVisible
          barStyle="dark-content"
          backgroundColor="rgba(0,0,0,0)"
          translucent
          animated
        />
      </View>
      {isLoading && <Loader />}
      <Stack screenOptions={{ headerShown: false }} initialRouteName="(auth)">
        <Stack.Screen name={!userData ? `(auth)` : `(tabs)`} />
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
};
