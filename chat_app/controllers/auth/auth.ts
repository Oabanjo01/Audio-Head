import axios, { AxiosResponse, Method } from "axios";
import { showToast } from "root/components/toast";
import {
  LoginResponse,
  ProfileResponse,
  ResetPasswordModel,
  SignInModel,
  SignUpModel,
  SignUpResponse,
} from "root/constants/types/authTypes";

import { refreshInstance } from "../tokenManager";

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

    const response = await refreshInstance.request(payLoad);

    return response;
  } catch (error) {
    // logErrorDetails(error);
    if (axios.isAxiosError(error)) {
      if (error.code === "ERR_NETWORK") {
        const response = error.request;
        if (response) {
          const message = response?._response;
          showToast({
            text1: "Error",
            text2: message,
            type: "error",
            position: "top",
          });
        }
      }
    }
    return null;
  }
};
