import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError } from "axios";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform, StatusBar, View } from "react-native";
import Toast from "react-native-toast-message";
import Loader from "root/components/customLoader";
import { showToast, toastConfig } from "root/components/toast";
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
      const token = await AsyncStorage.getItem("tokens");
      if (!token) return;
      const parsedAccessToken = JSON.parse(token);
      const response = (await authService<any, "profile">({
        endPoint: "profile",
        method: "GET",
        token: parsedAccessToken.refreshToken,
      })) as ProfileResponse;

      const { profile } = response;

      if (profile) {
        router.replace("/(tabs)/home");
        dispatch(login(profile));
      }
      // else {
      //   dispatch(login(null));
      //   router.replace("/(auth)/");
      // }
    } catch (error) {
      if (error instanceof AxiosError) {
        showToast({
          text1: "Session Expired",
          text2: "Your session has expired",
          type: "info",
        });
      }
      dispatch(loading(false));
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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name={userData === null ? `(auth)` : `(tabs)`} />
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
};
