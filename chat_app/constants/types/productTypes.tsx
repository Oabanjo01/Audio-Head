import { CategoriesNameType } from "../categories";

type ProductImage = { url: string; id: string };

export type CreateProductModel = {
  images: ProductImage[];
  thumbnail?: string;
  name: string;
  price: string;
  purchasingDate: unknown;
  category: CategoriesNameType | "";
  description: string;
};

export type CreateProductPayload = {
  formData: FormData;
};

export type GenericProductResponse = {
  message: string;
};

export type FetchProductListingResponse = {
  message: string;
};

export interface ProductType {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  price: string;
  images: string[];
  date: string | Date;
  description: string;
  seller: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface ProductListingResponse {
  listings: ProductType[];
}
