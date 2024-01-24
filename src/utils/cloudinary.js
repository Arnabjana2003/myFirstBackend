import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'
          
cloudinary.config({ 
  cloud_name: String(process.env.CLOUDINARY_NAME), 
  api_key: String(process.env.CLOUDINARY_API_KEY),
  api_secret: String(process.env.CLOUDINARY_API_SECRET),
  secure: true
});

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null
 
        //upload
        const uploadResponse = await cloudinary.uploader.upload(localFilePath,{
            resource_type: 'auto'
        })

        console.log(uploadResponse); //url will be get on uploadResponse.url
        return uploadResponse
    } catch (error) {
        console.log(error)
        //if the uploading operation get failed then delete the local file also
        fs.unlinkSync(localFilePath)
        throw error
    }
}

export default uploadOnCloudinary