type ProductImage = { url: string; id: string };

export type CreateProductModel = {
  images: ProductImage[];
  thumbnail?: string;
  name: string;
  price: number;
  purchasingDate: Date | string;
  category: string;
  description: string;
};
