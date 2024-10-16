import { AxiosResponse, Method } from "axios";
import { showToast } from "root/components/toast";
import {
  LoginResponse,
  ProfileResponse,
  ResetPasswordModel,
  SignInModel,
  SignUpModel,
  SignUpResponse,
} from "root/constants/types/authTypes";
import {
  handleApiError,
  isNetworkError,
  isServerError,
} from "root/utils/errorHandlers/axiosErrorHandler";
import { instance } from "src/apiInstance";

export type AuthData = SignUpModel | ResetPasswordModel | SignInModel;

export type AuthResponse =
  | LoginResponse
  | SignUpResponse
  | ProfileResponse
  | AxiosResponse;

type EndPointType =
  | "sign-in"
  | "sign-up"
  | "verify-token"
  | "profile"
  | "sign-out"
  | "refresh-token"
  | "generate-reset-password-link";

type AuthProps<T extends AuthData, E extends EndPointType> = {
  method: Method;
  endPoint: E;
  data?: T;
  token?: string;
};

export const authService = async <T extends AuthData, E extends EndPointType>({
  data,
  endPoint,
  method,
  token,
}: AuthProps<T, E>): Promise<AuthResponse | null> => {
  try {
    const headers: Record<string, string> = {};
    if (endPoint.includes("profile") || endPoint.includes("out")) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const payLoad = {
      method,
      url: `auth/${endPoint}`,
      data: data,
      headers,
    };

    const response = await instance.request(payLoad);
    return response;
  } catch (error: any) {
    if (isNetworkError(error)) {
      showToast({
        text1: "Connection Error",
        text2: "Please check your internet connection and try again.",
        type: "error",
        position: "top",
      });
    } else if (isServerError(error)) {
      showToast({
        text1: "Server Error",
        text2: "Our servers are experiencing issues. Please try again later.",
        type: "error",
        position: "top",
      });
    } else {
      handleApiError(error);
    }
    return null;
  }
};
