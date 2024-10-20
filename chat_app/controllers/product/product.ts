import { AxiosResponse, Method } from "axios";
import { showToast } from "root/components/toast";
import { CreateProductResponse } from "root/constants/types/productTypes";
import {
  handleApiError,
  isNetworkError,
  isServerError,
} from "root/utils/errorHandlers/axiosErrorHandler";
import { instance } from "src/apiInstance";

export type ProductData = FormData;

export type ProductResponse = CreateProductResponse | AxiosResponse;

type EndPointType = "create";

type ProductProps<T extends ProductData, E extends EndPointType> = {
  method: Method;
  endPoint: E;
  data?: T;
  token?: string;
};

export const productService = async <
  T extends ProductData,
  E extends EndPointType
>({
  data,
  endPoint,
  method,
  token,
}: ProductProps<T, E>): Promise<ProductResponse | null> => {
  try {
    const headers: Record<string, string> = {};
    // if (endPoint.includes("profile") || endPoint.includes("out")) {
    headers["Authorization"] = `Bearer ${token}`;
    headers["Content-Type"] = "multipart/form-data";
    // }

    const payLoad = {
      method,
      url: `product/${endPoint}`,
      data: data,
      headers,
    };

    console.log(payLoad, "Payload");

    const response = await instance.request(payLoad);
    return response;
  } catch (error: any) {
    if (isNetworkError(error)) {
      showToast({
        text1: "Connection Error",
        text2: "Please check your internet connection and try again.",
        type: "error",
        position: "top",
      });
    } else if (isServerError(error)) {
      showToast({
        text1: "Server Error",
        text2: "Our servers are experiencing issues. Please try again later.",
        type: "error",
        position: "top",
      });
    } else {
      handleApiError(error);
    }
    return null;
  }
};
