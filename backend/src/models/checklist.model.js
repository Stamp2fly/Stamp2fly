import mongoose from "mongoose";

const checklistItemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const checklistSchema = new mongoose.Schema(
  {
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },

    category: {
      type: String,
      enum: [
        "employed",
        "salaried",
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