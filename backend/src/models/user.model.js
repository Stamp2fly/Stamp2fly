import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    fullname: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      spase: true,
    },
    phone: {
      type: Number,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["user", "super_admin", "team"],
      default: "user",
    },
  },
  { timestamps: true },
);
