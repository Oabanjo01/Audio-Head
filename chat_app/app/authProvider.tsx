import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError } from "axios";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import { ProfileResponse } from "root/constants/types/authTypes";
import { getAuthState, loading, login } from "root/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "root/redux/store";
import { authService } from "root/services/auth";
import Loader from "root/utils/loader";
import { showToast, toastConfig } from "root/utils/toast";

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
      const { profile } = (await authService<any, "profile">({
        endPoint: "profile",
        method: "GET",
        token: parsedAccessToken.accessToken,
      })) as ProfileResponse;

      if (profile) {
        router.replace("/(tabs)");
        dispatch(login(profile));
      }
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
      <StatusBar
        networkActivityIndicatorVisible
        barStyle={"dark-content"}
        backgroundColor="transparent"
        translucent
        animated
      />
      {isLoading && <Loader />}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name={userData === null ? `(auth)` : `(tabs)`} />
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
};
