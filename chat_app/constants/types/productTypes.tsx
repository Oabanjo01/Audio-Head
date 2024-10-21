import { CategoriesNameType } from "../categories";

type ProductImage = { url: string; id: string };

export type CreateProductModel = {
  images: ProductImage[];
  thumbnail?: string;
  name: string;
  price: number;
  purchasingDate: unknown;
  category: CategoriesNameType | "";
  description: string;
};

export type CreateProductPayload = {
  formData: FormData;
};

export type CreateProductResponse = {
  message: string;
};
