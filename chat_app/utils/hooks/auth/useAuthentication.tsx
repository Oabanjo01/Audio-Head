import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { showToast } from "root/components/toast";
import {
  LoginResponse,
  ResetPasswordModel,
  SignInModel,
  SignUpModel,
} from "root/constants/types/authTypes";
import { AuthData, authService } from "root/controllers/auth/auth";
import { loading, login } from "root/redux/slices/authSlice";
import { useAppDispatch } from "root/redux/store";
import clearAllTokens from "root/utils/clearStorage";

export const useAuthentication = () => {
  const dispatch = useAppDispatch();

  const signIn = async (newPayLoad: AuthData) => {
    dispatch(loading(true));
    try {
      const response = await authService<SignInModel, "sign-in">({
        data: newPayLoad as SignInModel,
        endPoint: "sign-in",
        method: "post",
      });
      console.log(response, "response");
      if (!response) return;
      const { tokens, userData } = response.data as LoginResponse;
      const stringifiedTokens = JSON.stringify(tokens);

      await AsyncStorage.setItem("tokens", stringifiedTokens);

      dispatch(login({ ...userData, accessToken: tokens.accessToken }));

      router.replace("/(tabs)/home");
    } catch (e) {
      console.log(e, "errorrr ===");
    } finally {
      dispatch(loading(false));
    }
  };

  const signUp = async (newPayLoad: AuthData) => {
    dispatch(loading(true));
    const response = await authService<SignUpModel, "sign-up">({
      data: newPayLoad as SignUpModel,
      endPoint: "sign-up",
      method: "post",
    });
    if (response?.data && response.status >= 200 && response.status < 300) {
      router.replace("/(auth)/signUp");
    }
    dispatch(loading(false));
  };

  const signOut = async () => {
    const token = await AsyncStorage.getItem("tokens");
    console.log(token, "token ??");
    if (!token) return;
    const parsedAccessToken = JSON.parse(token);
    const response = await authService<any, "sign-out">({
      endPoint: "sign-out",
      method: "post",
      token: parsedAccessToken.accessToken,
      data: { refreshToken: parsedAccessToken.refreshToken },
    });
    if (response?.data && response.status >= 200 && response.status < 300) {
      router.replace("/(auth)/");
      dispatch(login(null));
      clearAllTokens();
    }
  };

  const forgotPassword = async (email: ResetPasswordModel) => {
    dispatch(loading(true));
    try {
      const response = await authService<
        ResetPasswordModel,
        "generate-reset-password-link"
      >({
        endPoint: "generate-reset-password-link",
        method: "POST",
        data: email,
      });
      console.log(response, "response");
      if (response?.data && response.status >= 200 && response.status < 300)
        showToast({
          text1: "Success",
          text2: (response as any).message,
          type: "success",
          position: "top",
        });
    } finally {
      dispatch(loading(false));
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    forgotPassword,
  };
};
