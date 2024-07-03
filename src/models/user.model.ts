import mongoose, { Schema } from "mongoose";

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

export const user = mongoose.model("User", userSchema);
