import { AxiosError, AxiosResponse, Method } from "axios";
import {
  LoginResponse,
  ProfileResponse,
  SignInModel,
  SignUpModel,
  SignUpResponse,
  VerifyEmailModel,
  VerifyEmailResponse,
} from "root/constants/types/authTypes";
import { showToast } from "root/utils/toast";
import { instance } from "src/api";

export type AuthData = SignUpModel | VerifyEmailModel | SignInModel;

export type AuthResponse =
  | LoginResponse
  | SignUpResponse
  | VerifyEmailResponse
  | ProfileResponse;

type EndPointType = "sign-in" | "sign-up" | "verify-token" | "profile";

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
}: AuthProps<T, E>): Promise<AxiosResponse<AuthResponse> | unknown> => {
  try {
    const headers = endPoint.startsWith("profile")
      ? { Authorization: `Bearer ${token}` }
      : {};

    console.log(`AuthService`, headers);
    const payLoad = {
      method,
      url: `auth/${endPoint}`,
      data,
      headers,
    };
    const response = await instance.request(payLoad);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.code === "ERR_NETWORK") {
        const response = error.request;
        if (response) {
          const message = response?._response;
          return showToast({
            text1: "Error",
            text2: message,
            type: "error",
            position: "top",
          });
        }
      }
    }
  }
};
