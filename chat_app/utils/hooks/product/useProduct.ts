import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "root/components/toast";
import { CreateProductResponse } from "root/constants/types/productTypes";
import { productService } from "root/controllers/product/product";
import { loading } from "root/redux/slices/authSlice";
import { useAppDispatch } from "root/redux/store";

export const useProduct = () => {
  const dispatch = useAppDispatch();

  const createProduct = async (newPayLoad: FormData) => {
    dispatch(loading(true));
    try {
      const token = await AsyncStorage.getItem("tokens");
      if (!token) return;
      const parsedAccessToken = JSON.parse(token);
      const response = await productService<FormData, "create">({
        data: newPayLoad,
        endPoint: "create",
        method: "POST",
        token: parsedAccessToken.accessToken,
      });
      console.log(response, "response");
      if (!response) return;
      const { message } = response as CreateProductResponse;

      showToast({
        text1: "Yayyy!",
        text2: message,
        position: "top",
        type: "success",
      });
    } catch (e) {
      console.log(e, "errorrr ===");
    } finally {
      dispatch(loading(false));
    }
  };

  return {
    createProduct,
  };
};
