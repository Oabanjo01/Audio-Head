import { UploadApiResponse } from "cloudinary";
import { RequestHandler } from "express";
import { unlink } from "fs";
import { isValidObjectId } from "mongoose";
import path from "path";
import sharp from "sharp";
import cloud, { cloudApi } from "src/cloudinary/config";
import ProductModel, { ProductDocument } from "src/models/productModel";
import { UserDocument } from "src/models/user";
import categories from "src/utilities/categories";
import { sendResponse } from "src/utilities/sendRequest";
import { promisify } from "util";

const unlinkAsync = promisify(unlink);

// Compress image before upload
const compressImage = async (filePath: string): Promise<string> => {
  const filename = path.parse(filePath).name;
  const outputPath = path.join(
    path.dirname(filePath),
    `${filename}_compressed.jpg`
  );

  await sharp(filePath)
    .resize(1280, 720, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 80,
      progressive: true,
    })
    .toFile(outputPath);

  return outputPath;
};

const uploadImage = async (filePath: string): Promise<UploadApiResponse> => {
  console.log(`Starting compression for ${filePath}`);
  const compressStartTime = Date.now();

  try {
    // Compress image before upload
    const compressedPath = await compressImage(filePath);
    const compressEndTime = Date.now();
    console.log(
      `Compression completed in ${compressEndTime - compressStartTime}ms`
    );

    // Upload with optimized settings
    const uploadStartTime = Date.now();
    const response = await cloud.upload(compressedPath, {
      resource_type: "auto",
      quality: "auto:good",
      fetch_format: "auto",
      flags: "progressive",
      transformation: {
        width: 1280,
        height: 720,
        crop: "fill",
        background: "transparent",
        gravity: "face",
      },
    });
    const uploadEndTime = Date.now();
    console.log(
      `Cloudinary upload completed in ${uploadEndTime - uploadStartTime}ms`
    );

    // Cleanup files
    await Promise.all([unlinkAsync(filePath), unlinkAsync(compressedPath)]);

    return response;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
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
  const startTime = Date.now();
  console.log(
    `Starting product creation at ${new Date(startTime).toISOString()}`
  );

  try {
    const { category, description, name, price, purchasingDate } = req.body;
    const { image } = req.files;

    if (!image) {
      return sendResponse(res, 422, "No image provided");
    }

    const newProduct = new ProductModel({
      owner: req.user.id,
      category,
      description,
      name,
      price,
      purchasingDate,
      images: [],
    });

    const multipleImages = Array.isArray(image);

    // Validate image count
    if (multipleImages && image.length > 5) {
      return sendResponse(res, 422, "Cannot upload more than 5 images");
    }

    // Validate image types
    const isValidImage = (file: any) =>
      file.mimetype?.startsWith("image") &&
      ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);

    if (multipleImages) {
      if (!image.every(isValidImage)) {
        return sendResponse(res, 422, "Invalid image format");
      }
    } else if (!isValidImage(image)) {
      return sendResponse(res, 422, "Invalid image format");
    }

    console.log("Starting upload process");
    if (multipleImages) {
      // Process images in smaller batches to prevent overwhelming the server
      const batchSize = 2;
      const images = [];

      for (let i = 0; i < image.length; i += batchSize) {
        const batch = image.slice(i, i + batchSize);
        const batchStartTime = Date.now();

        const batchResults = await Promise.all(
          batch.map((img) => uploadImage(img.filepath))
        );

        console.log(
          `Batch ${i / batchSize + 1} completed in ${
            Date.now() - batchStartTime
          }ms`
        );
        images.push(...batchResults);
      }

      newProduct.images = images.map(({ secure_url: url, public_id: id }) => ({
        id,
        url,
      }));
      newProduct.thumbnail = newProduct.images[0].url;
    } else {
      const result = await uploadImage(image.filepath);
      newProduct.images = [
        {
          id: result.public_id,
          url: result.secure_url,
        },
      ];
      newProduct.thumbnail = result.secure_url;
    }

    await newProduct.save();

    const endTime = Date.now();
    console.log(
      `Product creation completed at ${new Date(endTime).toISOString()}`
    );
    console.log(`Total duration: ${endTime - startTime}ms`);

    return sendResponse(res, 201, "Product has been successfully created.");
  } catch (error) {
    console.error("Product creation error:", error);
    return sendResponse(res, 500, "Failed to create product");
  }
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

  const productExists = await ProductModel.findOne({ _id: id, owner: userId });

  if (!productExists) {
    return sendResponse(res, 404, "Product not found");
  }

  const imageToDelete = productExists.images.find(
    (image) => image.id === imageId
  );

  if (imageToDelete && productExists.thumbnail === imageToDelete.url) {
    await ProductModel.updateOne({ _id: id }, { $unset: { thumbnail: "" } });

    // This works for just updating the thumbnail to an empty string
    // productExists.thumbnail = "";
    // await productExists.save();
  }

  await ProductModel.findOneAndUpdate(
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

  await cloud.destroy(imageId);

  res.json({ message: "Removed image successfully" });
};

const getProductDetails: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id))
    return sendResponse(res, 422, "Unauthorized request");

  const productExists = await ProductModel.findById(id).populate<{
    owner: UserDocument;
  }>("owner");

  if (!productExists) return sendResponse(res, 404, "Product not found");

  const {
    owner,
    category,
    price,
    purchasingDate,
    id: documentId,
    description,
    thumbnail,
    name,
    images,
  } = productExists;

  res.json({
    productData: {
      category,
      price,
      purchasingDate,
      id: documentId,
      description,
      thumbnail,
      images: images.map(({ url }) => url),
      name,
      seller: {
        email: owner.email,
        name: owner.name,
        avatar: owner?.avatar,
      },
    },
  });
};

const findByCategory: RequestHandler<
  { category: string },
  {},
  {},
  { page: string; limit: string }
> = async (req, res) => {
  const { category } = req.params;
  const { page = "1", limit = "10" } = req.query;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit); // amount of results returned

  if (!categories.includes(category))
    return res.status(400).json({ message: "Invalid category", category });

  // This is to calculate the number of items to skip
  const skip = (pageNumber - 1) * limitNumber;

  const productCategoryList = await ProductModel.find({
    category: category,
  })
    .collation({ locale: "en", strength: 2 })
    .sort({
      name: 1,
      categories: -1,
    })
    .skip(skip)
    .limit(limitNumber);

  if (!productCategoryList)
    return res
      .status(404)
      .json({ message: "No product categories found", category });

  const totalDocuments = await ProductModel.countDocuments({
    category: category,
  });

  // Calculate total number of pages
  const totalPages = Math.ceil(totalDocuments / limitNumber);

  res.json({
    categoryData: productCategoryList,
    totalPages,
    pageNumber,
  });
};

const getLatestProducts: RequestHandler<{}, {}, {}, {}> = async (req, res) => {
  const products = await ProductModel.find().sort("-createdAt").limit(10);

  const listings = products.map((p) => {
    return {
      id: p._id,
      name: p.name,
      thumbnail: p.thumbnail,
      category: p.category,
      price: p.price,
    };
  });

  res.json({
    listings,
  });

  // This is for if I wanted to add authentication and others
  // const { page = "1", limit = "10" } = req.query;

  // const pageNumber = parseInt(page);
  // const limitNumber = parseInt(limit);

  // if (isNaN(pageNumber) || pageNumber < 1)
  //   return sendResponse(res, 422, "Invalid page number");

  // if (isNaN(limitNumber) || limitNumber < 1)
  //   return sendResponse(res, 422, "Invalid limit number");

  // const skip = (pageNumber - 1) * limitNumber;

  // try {
  //   const allProducts = await ProductModel.find()
  //     .collation({ locale: "en", strength: 2 })
  //     .sort({ purchasingDate: 1 })
  //     .skip(skip)
  //     .limit(limitNumber);

  //   console.log("got here ===", allProducts);
  //   if (!allProducts) return sendResponse(res, 404, "No product found");

  //   res.json({
  //     productData: allProducts,
  //   });
  // } catch (error) {
  //   console.log(error);
  //   sendResponse(res, 400, "An eerror occured");
  // }
};

const getUserListings: RequestHandler<
  {},
  {},
  {},
  { page: string; limit: string }
> = async (req, res) => {
  const { id, avatar, name } = req.user;

  const { page = "1", limit = "10" } = req.query;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const skip = (pageNumber - 1) * limitNumber;

  const products = await ProductModel.find({ owner: id })
    .collation({ locale: "en", strength: 2 })
    .sort({
      name: 1,
      categories: -1,
    })
    .skip(skip)
    .limit(limitNumber);

  const listings = products.map((p) => {
    return {
      id: p._id,
      name: p.name,
      thumbnail: p.thumbnail,
      category: p.category,
      price: p.price,
      images: p.images.map(({ url }) => url),
      date: p.purchasingDate,
      description: p.description,
      seller: {
        id,
        name,
        avatar: avatar?.url,
      },
    };
  });

  res.json({
    listings,
  });
};

export {
  createNewProduct,
  deleteProduct,
  deleteProductImage,
  findByCategory,
  getLatestProducts,
  getProductDetails,
  getUserListings,
  updateExistingProduct,
};
