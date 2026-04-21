import mongoose from "mongoose";

const applicationFieldSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    section: {
      type: String,
      enum: ["travel", "financial", "review"],
      default: "travel",
    },
    target: {
      type: String,
      enum: ["application", "traveler"],
      default: "traveler",
    },
    fieldType: {
      type: String,
      enum: ["text", "textarea", "number", "date", "select", "file", "email", "tel"],
      required: true,
      default: "text",
    },
    required: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
      trim: true,
    },
    helpText: {
      type: String,
      default: "",
      trim: true,
    },
    options: {
      type: [String],
      default: [],
    },
    accept: {
      type: String,
      default: ".pdf,.jpg,.jpeg,.png",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ApplicationField", applicationFieldSchema);
