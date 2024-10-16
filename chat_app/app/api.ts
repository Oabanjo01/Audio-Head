import createAuthRefreshInterceptor from "axios-auth-refresh";
import { refreshToken } from "root/controllers/tokenManager";
import { store } from "root/redux/store";
import { handleApiError } from "root/utils/errorHandlers/axiosErrorHandler";
import { instance } from "src/apiInstance";

const publicRoutes = ["sign-in", "generate-reset-password-link"];

const authState = store.getState().auth;
const { userData } = authState;

instance.defaults.timeout = 10000;

instance.interceptors.request.use(
  async (config) => {
    if (config.url && !publicRoutes.includes(config?.url)) {
      if (userData?.accessToken) {
        config.headers["Authorization"] = `Bearer ${userData?.accessToken}`;
      }
    }
    return config;
  },
  async (error) => {
    handleApiError(error);
    return Promise.reject(error);
  }
);

createAuthRefreshInterceptor(instance, refreshToken);

instance.interceptors.response.use(
  async (response) => {
    console.log(response, "directly from responses api");
    return response.data;
  },
  async (error) => {
    handleApiError(error);
    return Promise.reject(error);
  }
);
