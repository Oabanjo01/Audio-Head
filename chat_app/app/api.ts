import { AxiosError } from "axios";
import { showToast } from "root/components/toast";
import { getAuthState } from "root/redux/slices/authSlice";
import { state } from "root/redux/store";
import { logErrorDetails } from "root/utils/customErrorLogger";

import { instance } from "./apiInstance";

instance.defaults.timeout = 10000;

const publicRoutes = ["sign-out", "generate-reset-password-link"];

// const refreshAuthentication = async (failedRequest: any) => {
//   try {
//     console.warn(" fired?? ==");
//     await refreshToken(failedRequest);
//   } catch (error) {
//     console.log("Error during token refresh", error);
//   }
// };

// createAuthRefreshInterceptor(instance, refreshAuthentication);

instance.interceptors.request.use(
  async (config) => {
    const authState = getAuthState(state);
    const { userData } = authState;
    console.log(authState, "authstate");
    if (!publicRoutes.includes(config.url || "")) {
      if (userData?.accessToken) {
        config.headers["Authorization"] = `Bearer ${userData?.accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    if (error instanceof AxiosError) {
      const response = error.response;
      if (response) {
        const { message } = response.data;
        console.log("======== user data ==     ===============", response.data);
        showToast({
          text1: "Error",
          text2: message,
          type: "error",
          position: "top",
        });
      }
    }
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  async (response) => {
    const { data } = response;
    const { message } = data;
    console.log("interceptorrrss =====");
    if (!response.config.url?.includes("profile")) {
      showToast({
        text1: "Success",
        text2: message,
        type: "success",
        position: "top",
      });
    }
    return data;
  },
  (error) => {
    logErrorDetails(error);
    console.log(error instanceof AxiosError, "message ===== 1111 =====");

    if (error instanceof AxiosError) {
      const response = error.response;
      if (response) {
        const { message } = response.data;
        return showToast({
          text1: "Error",
          text2: message,
          type: "error",
          position: "top",
        });
      }
    }
    console.log("error  ===", error);
    return Promise.reject(error);
  }
);
