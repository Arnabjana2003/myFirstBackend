import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const uploadResponse = await cloudinary.uploader.upload(localFilePath, {
      public_id: `firstbackend/${Date.now()}`,
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);

    // url will be get on uploadResponse.url
    return uploadResponse;
  } catch (error) {
    console.log("cloudinary error:", error);

    //if the uploading operation get failed then delete the local file also
    fs.unlinkSync(localFilePath);
    throw error;
  }
};
export default uploadOnCloudinary;
