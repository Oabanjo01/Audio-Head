import createAuthRefreshInterceptor from "axios-auth-refresh";
import { refreshToken } from "root/controllers/tokenManager";
import { store } from "root/redux/store";
import { handleApiError } from "root/utils/errorHandlers/axiosErrorHandler";
import { logErrorDetails } from "root/utils/errorHandlers/customErrorLogger";
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
    console.log(config.headers["Authorization"], "Config");
    return Promise.resolve(config);
  },
  async (error) => {
    logErrorDetails(error);
    handleApiError(error);
    return Promise.reject(error);
  }
);

createAuthRefreshInterceptor(instance, refreshToken);

instance.interceptors.response.use(
  async (response) => {
    console.log(response, "directly from responses api");
    return Promise.resolve(response.data);
  },
  async (error) => {
    handleApiError(error);
    return Promise.reject(error);
  }
);
