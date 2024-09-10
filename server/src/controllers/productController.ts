import { UploadApiResponse } from "cloudinary";
import { RequestHandler } from "express";
import cloud from "src/cloudinary/config";
import ProductModel, { ProductDocument } from "src/models/productModel";
import { sendResponse } from "src/utilities/sendRequest";

const uploadImage = async (filePath: string): Promise<UploadApiResponse> => {
  const response = await cloud.upload(filePath, {
    transformation: {
      width: 1280,
      height: 720,
      crop: "fill",
      background: "transparent",
      gravity: "face",
    },
  });

  return response;
};

const createNewProduct: RequestHandler<
  {},
  {},
  Required<
    Pick<
      ProductDocument,
      "name" | "description" | "price" | "purchasingDate" | "category"
    >
  >
> = async (req, res) => {
  const { category, description, name, price, purchasingDate } = req.body;
  const newProduct = new ProductModel({
    owner: req.user.id,
    category: category,
    description: description,
    name: name,
    price: price,
    purchasingDate: purchasingDate,
  });

  const { image } = req.files;

  let imageIsNotValid = false;

  const multipleImages = Array.isArray(image);

  if (multipleImages && image.length > 5)
    return sendResponse(res, 422, "Cannot upload more than 5 images");

  if (multipleImages) {
    // Image is an array
    for (let key in image) {
      if (!image[key].mimetype?.startsWith("image")) {
        imageIsNotValid = true;
        break;
      }
    }
  } else {
    // Image is not an array
    if (!image.mimetype?.startsWith("image")) {
      imageIsNotValid = true;
    }
  }

  if (imageIsNotValid) return sendResponse(res, 422, "Invalid image format");

  if (multipleImages) {
    const promisedResponse = image.map((image) => {
      return uploadImage(image.filepath);
    });

    const expectedResponse = await Promise.all(promisedResponse);

    newProduct.images = expectedResponse.map((image) => {
      const { secure_url: url, public_id: id } = image;
      return {
        id,
        url,
      };
    });

    newProduct.thumbnail = newProduct.images[0].url;
  } else {
    const { secure_url: url, public_id: id } = await uploadImage(
      image.filepath
    );
    newProduct.images[0] = { url: url, id: id };
    newProduct.thumbnail = url;
  }

  newProduct.save();

  sendResponse(res, 422, "This product has been successfully created.");
};

const updateExistingProduct: RequestHandler = (req, res) => {};

export { createNewProduct, updateExistingProduct };
