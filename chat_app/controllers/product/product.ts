import { AxiosResponse, Method } from "axios";
import { showToast } from "root/components/toast";
import {
  GenericProductResponse,
  ProductListingResponse,
} from "root/constants/types/productTypes";
import {
  handleApiError,
  isNetworkError,
  isServerError,
} from "root/utils/errorHandlers/axiosErrorHandler";
import { instance } from "src/apiInstance";

export type ProductData = FormData | {};

export type ProductResponse = GenericProductResponse | ProductListingResponse;

type EndPointType = "create" | "listings" | string;

type ProductProps<T extends ProductData, E extends EndPointType> = {
  method: Method;
  endPoint: E;
  data?: T;
  payload?: any;
};

export const productService = async <
  T extends ProductData,
  E extends EndPointType
>({
  data,
  endPoint,
  method,
  payload,
}: ProductProps<T, E>): Promise<AxiosResponse<ProductResponse> | null> => {
  try {
    const payLoad = {
      method,
      url: `product/${endPoint}`,
      data,
      payload,
    };

    console.log(payLoad, "payLoad");

    const response = await instance.request<
      T,
      AxiosResponse<ProductResponse, any>,
      any
    >(payLoad);
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
