import axios, { AxiosError } from "axios";
import { showToast } from "root/utils/toast";

export const instance = axios.create({
  baseURL: "http://192.168.0.168:8000/",
});

instance.defaults.timeout = 10000;

const logErrorDetails = (error: any) => {
  const propertyNames = Object.getOwnPropertyNames(error);
  propertyNames.forEach((propertyName) => {
    console.log(`${propertyName}:`, error[propertyName]);
  });
};

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
    // Any status code that lie within the range of 2xx

    const { data } = response;
    const { message } = data;

    showToast({
      text1: "Success",
      text2: message,
      type: "success",
      position: "top",
    });
    return response;
  },
  (error) => {
    logErrorDetails(error);
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
        console.log("Axios error -2", message);
      }
    }
    // Any status codes that falls outside the range of 2xx
    return Promise.reject(error);
  }
);
