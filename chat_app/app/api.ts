import AsyncStorage from "@react-native-async-storage/async-storage";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { refreshToken } from "root/controllers/tokenManager";
import { handleApiError } from "root/utils/errorHandlers/axiosErrorHandler";
import { logErrorDetails } from "root/utils/errorHandlers/customErrorLogger";
import { instance } from "src/apiInstance";

const publicRoutes = ["sign-in", "generate-reset-password-link"];

instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("tokens");
    if (token && config.url && !publicRoutes.includes(config?.url)) {
      const parsedTokens = JSON.parse(token);
      if (parsedTokens?.accessToken) {
        config.headers["Authorization"] = `Bearer ${parsedTokens?.accessToken}`;
      }
      if (config.url.includes("product")) {
        console.log("here is a product");
        config.headers["Content-Type"] = "multipart/form-data";
      }
    }
    console.log(config.data, config.url, "Config");
    return config;
  },
  async (error) => {
    logErrorDetails(error);
    handleApiError(error);
    return Promise.reject(error);
  }
);

createAuthRefreshInterceptor(instance, refreshToken, {
  pauseInstanceWhileRefreshing: true,
  shouldRefresh: (error) => {
    return (
      error.response?.status === 401 &&
      !error.config?.url?.includes("auth/sign-out")
    );
  },
});

instance.interceptors.response.use(
  async (response) => {
    console.log(response, "directly from responses api");
    return response;
  },
  (error) => {
    logErrorDetails(error);
    handleApiError(error);
    return error;
  }
);
