import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { showToast } from "root/components/toast";
import { LoginResponse } from "root/constants/types/authTypes";
import { store } from "root/redux/store";

export const refreshInstance = axios.create({
  baseURL: "http://192.168.0.168:8000/", // house wifi
  headers: {
    "content-type": "application/json",
  },
  responseType: "json",
});

const publicRoutes = ["sign-in", "generate-reset-password-link"];

export const refreshToken = async (failedRequest: any) => {
  const authState = store.getState().auth;
  const { userData } = authState;
  const token = await AsyncStorage.getItem("tokens");

  refreshInstance.interceptors.request.use(
    async (config) => {
      if (!publicRoutes.includes(config.url || "")) {
        if (userData?.accessToken) {
          config.headers["Authorization"] = `Bearer ${userData?.accessToken}`;
        }
      }
      console.log(config.headers, "config ====??");
      return config;
    },
    (error) => {
      if (error instanceof AxiosError) {
        const response = error.response;
        if (response) {
          const { message } = response.data;
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

  refreshInstance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
      const originalRequest = error.config;
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

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          if (!token) return;
          const parsedAccessToken = JSON.parse(token);
          const response = (await refreshInstance.post("auth/refresh-token", {
            refreshToken: parsedAccessToken.refreshToken,
          })) as Omit<LoginResponse, "message">;

          const { tokens } = response;

          await AsyncStorage.setItem("tokens", JSON.stringify(tokens));
          failedRequest.response.config.headers["Authorization"] =
            "Bearer " + tokens.accessToken;
        } catch (error) {
          //   logErrorDetails(error);
        }
      }
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
      return Promise.reject(error);
    }
  );
};

createAuthRefreshInterceptor(refreshInstance, refreshToken);

// export const refreshToken = async (failedRequest: any) => {
//   const dispatch = store.dispatch;

//   const userData = await AsyncStorage.getItem("userData");
//   console.log(userData, "Homepage");

//   const token = await AsyncStorage.getItem("tokens");
//   if (!token || !userData) {
//     console.error("No tokens found in AsyncStorage");
//     return;
//   }
//   const parsedToken = JSON.parse(token);
//   const { tokens } = (await authService<any, "refresh-token">({
//     endPoint: "refresh-token",
//     method: "POST",
//     data: { refreshToken: parsedToken.refreshToken },
//   })) as Omit<LoginResponse, "message">;

//   if (tokens) {
//     failedRequest.response.config.headers["Authorization"] =
//       "Bearer " + tokens.accessToken;
//     await AsyncStorage.setItem("tokens", JSON.stringify(tokens));

//     dispatch(
//       login({
//         ...JSON.parse(userData),
//         accessToken: tokens.accessToken,
//       })
//     );

//     console.log("got here successfully ???");
//     return Promise.resolve();
//   }
// };
