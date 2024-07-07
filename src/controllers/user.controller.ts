import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { newUserBody } from "../types/types";
import { ApiError } from "../utils/apiError";
import { User } from "../models/user.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/apiResponse";

const registerUser = asyncHandler(
  async (req: Request<{}, {}, newUserBody>, res: Response) => {
    // Get user details from client
    // Validation
    // check if user already exists
    // Check for files
    // Upload them to cloudinary
    // Create User object
    // Check if user created or not
    // Remove Refresh token and password from user object
    // Return the response

    const { email, fullname, password, username } = req.body;

    if ([email, fullname, password, username].some((field) => !field)) {
      throw new ApiError(400, "All Fields are required");
    }

    const existedUSer = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUSer) {
      throw new ApiError(409, "Username or Email Alredy exists");
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const avatarLocalPath = files["avatar"]
      ? files["avatar"][0].path
      : undefined;
    const coverImageLocalPath = files["coverImage"]
      ? files["coverImage"][0].path
      : undefined;

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(
      coverImageLocalPath ? coverImageLocalPath : ""
    );

    if (!avatar) {
      throw new ApiError(500, "Avatar file is upload to cloudinary is failed");
    }

    const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage ? coverImage?.url : "",
      email,
      password,
      username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
      "-refreshToken -password"
    );

    if (!createdUser)
      throw new ApiError(500, "Something went wrong while user creation");

    return res
      .status(201)
      .json(new ApiResponse(createdUser, 200, "User Registed Successfully"));
  }
);

export { registerUser };
