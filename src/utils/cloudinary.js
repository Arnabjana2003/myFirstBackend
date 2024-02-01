import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath,folder="",userid="") => {
  try {
    if (!localFilePath) return null;

    const uploadResponse = await cloudinary.uploader.upload(localFilePath, {
      public_id: `firstbackend/${folder}/${userid || Date.now()}`,
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);

    // url will be get on uploadResponse.url
    return uploadResponse;
  } catch (error) {
    console.log("cloudinary error while uploading:", error);

    //if the uploading operation get failed then delete the local file also
    fs.unlinkSync(localFilePath);
    throw error;
  }
};

const deleteFromCloudinary = async (publicIdToDelete)=>{
  try {
    const deletedResponse = await cloudinary.uploader.destroy(`firstbackend/${publicIdToDelete}`);
    return deletedResponse.result
  } catch (error) {
    console.log("cloudinary error while deleting:", error);
    throw error;
  }
}
export {uploadOnCloudinary,deleteFromCloudinary};
