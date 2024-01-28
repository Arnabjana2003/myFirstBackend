import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

const generateAccessAndRefreshToken = (userRef) => {
  try {
    const accessToken = userRef.generateAccessToken();
    const refreshToken = userRef.generateRefreshToken();
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(505, error.message);
  }
};

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
  return res
    .status(201)
    .json(new ApiResponse(201, "Registered successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  //check if the userName or email is missing
  if (!(userName || email)) {
    throw new ApiError(404, "Email or Username is required");
  }

  //find the user
  const userRef = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!userRef) {
    throw new ApiError(404, "User does not exsit");
  }

  //check password
  const isPasswordCorrect = await userRef.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Incorrect Password");

  //generate access and refresh token
  const { accessToken, refreshToken } = generateAccessAndRefreshToken(userRef);
  userRef.refreshToken = refreshToken;
  const data = await userRef.save({ validateBeforeSave: false });

  if (!data) throw new ApiError(505, "refresh token not saved");

  //remove fields
  data.password = undefined;
  data.refreshToken = undefined;


  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, "Logged In successfully", {
        userDetails: data,
        accessToken,
        refreshToken,
      })
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  
  //delete refresh token from db
  const data = await User.findById(req.userData._id);
  data.refreshToken = undefined;
  await data.save({ validateBeforeSave: false });



  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, "Logged out successfully", {}));
});

const refreshAccessToken = asyncHandler( async (req,res)=>{
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken || req.header("refreshToken")
  if(!incomingRefreshToken) throw new ApiError(404,"Missing Refresh token")

  //verify the token
  const decodedValue = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

  //get the user
  const user = await User.findById(decodedValue?._id)
  if(!user) throw new ApiError(401,"Unauthorized request");

  //check the token
  if(incomingRefreshToken !== user.refreshToken) throw new ApiError(401, "Token is expired")

  const {accessToken,refreshToken} = generateAccessAndRefreshToken(user)

  //set new refresh token to the database
  user.refreshToken = refreshToken
  await user.save({validateBeforeSave: false})

  return res
  .status(200)
  .cookie("refreshToken",refreshToken,cookieOptions)
  .cookie("accessToken",accessToken,cookieOptions)
  .json(
    new ApiResponse(200,
      "Access token is refreshed",{refreshToken,accessToken})
  )

})

const currentUser = asyncHandler(async (req,res)=>{
  const user = await User.findById(req.userData._id).select("-password -refreshToken");
  if(!user) throw new ApiError(404,"User not found");
  res.status(200).json( new ApiResponse(200,"User fetched successfully",user))
})

const updatePassword = asyncHandler(async (req,res)=>{
  const {oldPassword,newPassword} = req.body

  const user = await User.findById(req.userData?._id)
  const isCorrect = await user.isPasswordCorrect(oldPassword)
  if(!isCorrect) throw new ApiError(401, "Wrong password entered");

  user.password = newPassword;
  const userRef = await user.save({validateBeforeSave: false})
  if(!userRef) throw new ApiError(505, "Failed to save new password")

  return res
  .status(200)
  .json(
    new ApiResponse(200, "Password changed successfully", {})
  )

})

export { registerUser, loginUser, logoutUser,refreshAccessToken,currentUser, updatePassword};
