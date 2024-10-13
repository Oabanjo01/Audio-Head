import axios, { AxiosError } from "axios";
import { showToast } from "root/utils/toast";

export const instance = axios.create({
  // baseURL: "http://localhost/",
  // baseURL: "http://192.168.1.168:8000/", // shaks wifi
  // baseURL: "http://10.128.59.200:8000/", // office wifi
  baseURL: "http://192.168.0.168:8000/", // house wifi
});

instance.defaults.timeout = 10000;

instance.interceptors.request.use(
  async (config) => {
    console.log(config, "request");
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
    console.log("here ===", data);
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
    console.log("error ===", error);
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
