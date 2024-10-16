import { AxiosError } from "axios";
import { showToast } from "root/components/toast";

export interface ErrorResponse {
  message: string;
  code?: string;
}

export const handleApiError = async (
  error: AxiosError<ErrorResponse>
): Promise<void> => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        showToast({
          text1: "Bad Request",
          text2: data.message || "Invalid data sent to the server",
          type: "error",
          position: "top",
        });
        break;
      case 401:
        showToast({
          text1: "Unauthorized",
          text2: data.message || "Please log in again",
          type: "error",
          position: "top",
        });
        break;
      case 403:
        showToast({
          text1: "Forbidden",
          text2:
            data.message || "You do not have permission to perform this action",
          type: "error",
          position: "top",
        });
        break;
      case 404:
        showToast({
          text1: "Not Found",
          text2: data.message || "The requested resource was not found",
          type: "error",
          position: "top",
        });
        break;
      case 500:
        showToast({
          text1: "Server Error",
          text2: data.message || "An unexpected error occurred on the server",
          type: "error",
          position: "top",
        });
        break;
      default:
        showToast({
          text1: "Error",
          text2: data.message || `Request failed with status ${status}`,
          type: "error",
          position: "top",
        });
    }
  } else if (error.request) {
    showToast({
      text1: "Network Error",
      text2:
        "No response received from the server. Please check your connection.",
      type: "error",
      position: "top",
    });
  } else {
    showToast({
      text1: "Error",
      text2: error.message || "An unexpected error occurred",
      type: "error",
      position: "top",
    });
  }
};

export const isNetworkError = (error: any): boolean => {
  return !error.response && error.request;
};

export const isServerError = (error: AxiosError): boolean => {
  return error.response?.status ? error.response.status >= 500 : false;
};
