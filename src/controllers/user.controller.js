import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { userName, fullName, email, password } = req.body;

  //checking if any field is missing
  if (
    !(userName && fullName && email && password) ||
    [userName, fullName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required", "all fields reuired");
  }

  //checking if the user exists or not
  const isExistingUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (isExistingUser) {
    throw new ApiError(409, "User already exists");
  }

  //collecting images path
  let profileImgPath, coverImgPath;
  if (req.files) {
    const file = req.files;
    if (file.profileImage) profileImgPath = file.profileImage[0].path;
    if (file.coverImage) coverImgPath = file.coverImage[0].path;
  }

  // uploading images on the cloudinary
  let profileImgLink, coverImgLink;
  if (profileImgPath) {
    profileImgLink = await uploadOnCloudinary(profileImgPath);
  }
  if (coverImgPath) {
    coverImgLink = await uploadOnCloudinary(coverImgPath);
  }

  //register the user
  const createdUser = await User.create({
    fullName,
    userName: userName.toLowerCase(),
    password,
    email,
    profileImage: profileImgLink?.secure_url || "",
    coverImage: coverImgLink?.secure_url || "",
  });

  if (!createdUser) {
    throw new ApiError(500, "Error occur in the database");
  }

  // removing the password and refreshToken from the obj
  createdUser["password"] = undefined;
  createdUser.refreshToken = undefined;

  //sending response
  res
    .status(201)
    .json(new ApiResponse(201, "Registered successfully", createdUser));
});

export { registerUser };
