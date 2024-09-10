import { Document, model, Schema } from "mongoose";
import categories from "src/utilities/categories";

type ProductImage = { url: string; id: string };

export interface ProductDocument extends Document {
  owner: Schema.Types.ObjectId;
  images: ProductImage[];
  thumbnail: string;
  name: string;
  price: string;
  purchasingDate: Date | string;
  category: string;
  description: string;
}

export const productSchema = new Schema<ProductDocument, {}>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
    },
    purchasingDate: {
      type: Date,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: categories,
      required: true,
    },
    images: [
      {
        type: Object,
        url: { type: String, required: true },
        id: { type: String, required: true },
      },
    ],
    thumbnail: String,
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = model<ProductDocument>("Product", productSchema);
export default ProductModel;
