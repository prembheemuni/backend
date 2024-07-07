import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { loginUserBody, newUserBody } from "../types/types";
import { ApiError } from "../utils/apiError";
import { User } from "../models/user.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/apiResponse";

const generateRefreshTokenAndAccessToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    // this flag saves refreshToken to the userObj and does not through errors for required fields
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};

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

const loginUser = asyncHandler(async function (
  req: Request<{}, {}, loginUserBody>,
  res: Response
) {
  // req.body -> data
  // validation
  // Check password
  // Generate accessToken and refreshToken
  // Send cookies
  // Send Response json

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "Please provide all fields");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Credentials");
  }

  const { accessToken, refreshToken } =
    await generateRefreshTokenAndAccessToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // cookie options
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(loggedInUser, 200, "User Logged in successfully"));
});

const logoutUser = asyncHandler(async function (
  req: { user: { _id: any } },
  res: Response
) {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  // cookie options
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse({}, 200, "User Log out successfull"));
});

export { registerUser, loginUser, logoutUser };
