import { useState } from "react";
import { showToast } from "root/components/toast";
import {
  GenericProductResponse,
  ProductListingResponse,
  ProductType,
} from "root/constants/types/productTypes";
import { productService } from "root/controllers/product/product";
import { loading } from "root/redux/slices/authSlice";
import { useAppDispatch } from "root/redux/store";

export const useProduct = () => {
  const dispatch = useAppDispatch();

  const [productListing, setProductListing] = useState<ProductType[]>([]);

  const createProduct = async (newPayLoad: FormData) => {
    dispatch(loading(true));
    console.log("got here");
    try {
      const response = await productService<FormData, "create">({
        data: newPayLoad,
        endPoint: "create",
        method: "POST",
      });
      if (response?.data && response.status >= 200 && response.status < 300) {
        const { message } = response.data as GenericProductResponse;
        showToast({
          text1: "Yayyy!",
          text2: message,
          position: "top",
          type: "success",
        });
      }
    } catch (e) {
      console.log(e, "errorrr ===");
    } finally {
      dispatch(loading(false));
    }
  };

  const updateProduct = async (newPayLoad: FormData, productId: string) => {
    dispatch(loading(true));
    console.log("got here");
    try {
      const response = await productService<FormData, any>({
        data: newPayLoad,
        endPoint: `${productId}`,
        method: "PATCH",
      });
      if (response?.data && response.status >= 200 && response.status < 300) {
        const { message } = response.data as GenericProductResponse;
        showToast({
          text1: "Yayyy!",
          text2: message,
          position: "top",
          type: "success",
        });
      }
    } catch (e) {
      console.log(e, "errorrr ===");
    } finally {
      dispatch(loading(false));
    }
  };

  const deleteImage = async (id: string, productId: string) => {
    dispatch(loading(true));
    try {
      const response = await productService<any, any>({
        endPoint: `image/${id}/${productId}`,
        method: "DELETE",
      });
      if (response?.data && response.status >= 200 && response.status < 300) {
        const { message } = response.data as GenericProductResponse;
        // router.navigate("/(screens)/userProducts");
        showToast({
          text1: "Yayyy!",
          text2: message,
          position: "top",
          type: "success",
        });
      }
    } catch (e) {
      console.log(e, "errorrr ===");
    } finally {
      dispatch(loading(false));
    }
  };

  const fetchProductListing = async () => {
    dispatch(loading(true));
    try {
      const response = await productService<any, "listings">({
        endPoint: "listings",
        method: "GET",
      });
      if (response?.data && response.status >= 200 && response.status < 300) {
        const { listings } = response.data as ProductListingResponse;
        setProductListing(listings);
        // showToast({
        //   text1: "Yayyy!",
        //   text2: message,
        //   position: "top",
        //   type: "success",
        // });
      }
    } catch (e) {
      console.log(e, "errorrr ===");
    } finally {
      dispatch(loading(false));
    }
  };

  const deletProduct = async (id: string) => {
    dispatch(loading(true));
    try {
      const response = await productService<any, string>({
        endPoint: `${id}`,
        method: "DELETE",
        payload: {
          id,
        },
      });
      if (response?.data && response.status >= 200 && response.status < 300) {
        showToast({
          text1: "Product deleted",
          text2: "This product has been deleted",
          position: "top",
          type: "success",
        });
      }
    } catch (e) {
      console.log(e, "errorrr ===");
    } finally {
      dispatch(loading(false));
    }
  };

  return {
    createProduct,
    fetchProductListing,
    productListing,
    deletProduct,
    deleteImage,
  };
};
