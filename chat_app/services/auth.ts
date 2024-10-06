import { AxiosError, AxiosResponse, Method } from "axios";
import {
  SignInModel,
  SignUpModel,
  VerifyEmailModel,
} from "root/constants/types/authFunctions";
import { showToast } from "root/utils/toast";
import { instance } from "src/api";

export type AuthData = SignUpModel | VerifyEmailModel | SignInModel;

type EndPointType = "sign-in" | "sign-up" | "verify-token";

type AuthProps<T extends AuthData> = {
  method: Method;
  endPoint: EndPointType;
  data: T;
};

export const authService = async <T extends AuthData>({
  data,
  endPoint,
  method,
}: AuthProps<T>): Promise<AxiosResponse | unknown> => {
  try {
    const response = await instance.request({
      method,
      url: `auth/${endPoint}`,
      data,
    });
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
