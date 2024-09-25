import { UploadApiResponse } from "cloudinary";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import cloud, { cloudApi } from "src/cloudinary/config";
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

  if (imageIsNotValid) {
    return sendResponse(res, 422, "Invalid image format");
  } else {
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
  }

  await newProduct.save();

  sendResponse(res, 422, "This product has been successfully created.");
};

const updateExistingProduct: RequestHandler<
  { id: string },
  {},
  Partial<
    Pick<
      ProductDocument,
      | "name"
      | "description"
      | "price"
      | "purchasingDate"
      | "category"
      | "thumbnail"
    >
  >
> = async (req, res) => {
  const { id } = req.params; // product id
  const { image } = req.files;
  const { id: userId } = req.user; // the users id

  const { category, description, name, price, purchasingDate, thumbnail } =
    req.body;

  if (!isValidObjectId(id))
    return sendResponse(res, 422, "Unauthorized request");

  //   if (userId === id) return sendResponse(res, 422, "Unauthorized request");

  const productExists = await ProductModel.findOneAndUpdate(
    { _id: id, owner: userId },
    {
      category: category,
      description: description,
      name: name,
      price: price,
      purchasingDate: purchasingDate,
      thumbnail: thumbnail,
    }
  );

  if (!productExists) return sendResponse(res, 422, "Product does not exist");

  if (typeof thumbnail === "string") productExists.thumbnail = thumbnail;

  let imageIsNotValid = false;

  const multipleImages = Array.isArray(image);

  if (multipleImages) {
    if (image.length + productExists.images.length > 5)
      return sendResponse(res, 422, "Cannot upload more than 5 images");
  }

  if (multipleImages) {
    for (let key in image) {
      if (!image[key].mimetype?.startsWith("image")) {
        imageIsNotValid = true;
        break;
      }
    }
  } else {
    if (image) {
      if (!image.mimetype?.startsWith("image")) {
        imageIsNotValid = true;
      }
    }
  }

  if (imageIsNotValid) {
    return sendResponse(res, 422, "Invalid image format");
  }

  if (multipleImages) {
    const promisedResponse = image.map((image) => {
      return uploadImage(image.filepath);
    });

    const expectedResponse = await Promise.all(promisedResponse);

    const imageToBeUploaded = expectedResponse.map((image) => {
      const { secure_url: url, public_id: id } = image;
      return {
        id,
        url,
      };
    });

    productExists.images.push(...imageToBeUploaded);
  } else {
    if (image) {
      const { secure_url: url, public_id: id } = await uploadImage(
        image.filepath
      );
      productExists.images.push({ id: id, url: url });
    }
  }

  await productExists.save();

  sendResponse(res, 422, "This product has been successfully updated.");
};

const deleteProduct: RequestHandler = async (req, res) => {
  const id = req.params.id;

  const { id: userId } = req.user;

  if (!isValidObjectId(id))
    return sendResponse(res, 422, "Unauthorized request");

  const productExists = await ProductModel.findOneAndDelete({
    _id: id,
    owner: userId,
  });

  if (!productExists) return sendResponse(res, 422, "Product does not exist");

  if (productExists.images.length) {
    // removing images
    const ids = productExists.images.map(({ id }) => id);

    await cloudApi.delete_resources(ids);
  }

  sendResponse(res, 201, "Product has been successfully deleted");
};

const deleteProductImage: RequestHandler = async (req, res) => {
  const { id, imageId } = req.params; // product id
  const { id: userId } = req.user; // the users id

  if (!isValidObjectId(id))
    return sendResponse(res, 422, "Unauthorized request");

  const productExists = await ProductModel.findOneAndUpdate(
    { _id: id, owner: userId },
    {
      $pull: {
        images: { id: imageId },
      },
    },
    {
      new: true,
    }
  );

  // updating the thumbnail
  if (productExists?.thumbnail === imageId) {
    await ProductModel.findOneAndUpdate(
      { _id: id, owner: userId },
      { $unset: { thumbnail: "" } },
      {
        new: true,
      }
    );
  }

  if (!productExists) return sendResponse(res, 404, "Product not found");

  await cloud.destroy(imageId);

  res.json({ message: "Removed image successfully" });
};

export {
  createNewProduct,
  deleteProduct,
  deleteProductImage,
  updateExistingProduct,
};
