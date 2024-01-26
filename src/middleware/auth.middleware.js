import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const auth = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) throw new ApiError(401, "Unauthorized request");

  //verify the access token from jwt
  const decodedValue = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  if (!decodedValue) throw new ApiError(500, "Failed to match access token");

  //find the user
  const userData = await User.findById(decodedValue._id).select(
    "-password -refreshToken"
  );
  if (!userData) throw new ApiError(401, "Invalid access token");

  //inject user details in the request
  req.userData = userData;

  next();
});

export default auth;
