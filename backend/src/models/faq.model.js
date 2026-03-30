import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },

    tags: [
      {
        type: String,
      },
    ],

    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },

    isGlobal: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("FAQ", faqSchema);