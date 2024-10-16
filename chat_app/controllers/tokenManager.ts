import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "root/redux/slices/authSlice";
import { store } from "root/redux/store";
import { refreshInstance } from "src/apiInstance";

const authState = store.getState().auth;
const dispatch = store.dispatch;
const { userData } = authState;
refreshInstance.defaults.timeout = 5000;

export const refreshToken = async (failedRequest: any) => {
  const originalRequest = failedRequest.config;
  if (failedRequest.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    const token = await AsyncStorage.getItem("tokens");
    if (!token) return;
    try {
      const parsedToken = JSON.parse(token);
      const response = await refreshInstance.post("auth/refresh-token", {
        refreshToken: parsedToken.refreshToken,
      });
      const { tokens } = response.data;

      if (userData)
        dispatch(login({ ...userData, accessToken: tokens.accessToken }));
      await AsyncStorage.setItem("tokens", JSON.stringify(tokens));
      failedRequest.response.config.headers["Authorization"] =
        "Bearer " + tokens.accessToken;
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
};
