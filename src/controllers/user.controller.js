import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { userName, fullName, email, password } = req.body;

  if (
    !(userName && fullName && email && password) ||
    [userName, fullName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required", "all fields reuired");
  }

  //   const isExistingUser = await User.findOne({
  //     $or : [{userName},{email}]
  //   })
  //   if(isExistingUser) throw new ApiError(409,"Username or email already exists")
  const profileImagePath = req.files?.profileImage[0]?.path;

//   const imgUrl = await uploadOnCloudinary(profileImagePath);
//   console.log(imgUrl);
//   if(!imgUrl) throw new ApiError(500, "Image upload failed")
 await User.create({
    fullName
  })
  res.json({ msg: "ok" });
});

export { registerUser };
