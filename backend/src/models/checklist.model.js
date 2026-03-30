import mongoose from "mongoose";

const checklistItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,

  isRequired: {
    type: Boolean,
    default: true,
  },
});

const checklistSchema = new mongoose.Schema(
  {
    country: {
      type: String, // or ObjectId later
      required: true,
    },

    category: {
      type: String,
      enum: [
        "base",
        "employee",
        "self-employed",
        "student",
        "freelancer",
        "retired",
        "unemployed",
      ],
      required: true,
    },

    items: [checklistItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Checklist", checklistSchema);