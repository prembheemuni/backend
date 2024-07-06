import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file upload successfull
    console.log(response.url, "as upload url");
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    // Removing the locally saved temporary file when upload fails
    return null;
  }
};

export { uploadOnCloudinary };
