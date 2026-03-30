import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["user", "super_admin", "team"],
      default: "user",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    authProvider: {
      type: String,
      enum: ["google", "email"],
      required: true,
    },
    opt: {
      type: String,
      otpExpiry: Date,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
export const User = mongoose.model("User", userSchema);
