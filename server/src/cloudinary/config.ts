import { v2 as cloudinary } from "cloudinary";
import { storedValues } from "src/variables";

cloudinary.config({
  cloud_name: storedValues.cloudName,
  api_key: storedValues.cloudKey,
  api_secret: storedValues.cloudSecret,
  secure: true,
});

const cloud = cloudinary.uploader;

export default cloud;
