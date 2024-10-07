import axios, { AxiosError } from "axios";
import { showToast } from "root/utils/toast";

export const instance = axios.create({
  baseURL: "http://192.168.0.168:8000/",
});

instance.defaults.timeout = 10000;

instance.interceptors.request.use(
  async (config) => {
    console.log(config, "request");
    return config;
  },
  (error) => {
    console.log(error, "error");
    if (error instanceof AxiosError) {
      const response = error.response;
      if (response) {
        const { message } = response.data;
        console.log(message, "====message====");
        showToast({
          text1: "Error",
          text2: message,
          type: "error",
          position: "top",
        });
      }
    }
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
        console.log("Axios error -1", response);
      }
    }
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  async (response) => {
    const { data } = response;
    const { message } = data;
    console.log(response.config.url, "here ===");
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
    // logErrorDetails(error);

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
