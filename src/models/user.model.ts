import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const ACCESS_TOKEN_SECRET = "thisismyaccestokensecret";
const ACCESS_TOKEN_EXPIRY = "1d";

const REFRESH_TOKEN_SECRET = "thisismyREFRESHtokensecret";
const REFRESH_TOKEN_EXPIRY = "10d";

const watchHistorySchema = new Schema({
  type: Schema.Types.ObjectId,
  ref: "Video",
});

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloundinary image
      required: true,
    },
    coverImage: {
      type: String, // cloundinary image
    },
    watchHistory: [watchHistorySchema],
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// pre is a middleware where it cab be executed just before the save call on userSchema
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// We can able to create custom methods for userSchema using methods prototype
userSchema.methods.isPassowordCorrect = async function (password: string) {
  await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

export const user = mongoose.model("User", userSchema);
