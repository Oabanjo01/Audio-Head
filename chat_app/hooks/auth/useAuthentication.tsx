import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  LoginResponse,
  ResetPasswordModel,
  SignInModel,
  SignUpModel,
} from "root/constants/types/authTypes";
import { loading, login } from "root/redux/slices/authSlice";
import { useAppDispatch } from "root/redux/store";
import { AuthData, authService } from "root/services/auth";
import { showToast } from "root/utils/toast";

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

      const { tokens, userData } = response as LoginResponse;

      const token = JSON.stringify(tokens);

      await AsyncStorage.setItem("tokens", token);
      router.replace("/(tabs)/home");
      dispatch(login(userData));
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
    if (response) {
      router.back();
    }
    dispatch(loading(false));
  };

  const signOut = async () => {
    const token = await AsyncStorage.getItem("tokens");
    if (!token) return;
    const parsedAccessToken = JSON.parse(token);
    console.log(parsedAccessToken.accessToken, "parsedAccessToken.accessToken");
    const response = await authService<any, "sign-out">({
      endPoint: "sign-out",
      method: "GET",
      token: parsedAccessToken.accessToken,
    });
    if (response) return router.replace("/(auth)/");
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
      if (response)
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
