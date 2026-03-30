import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "submitted", "in-review", "approved", "rejected"],
      default: "draft",
    },

    // Traveller Details
    fullName: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: String,

    travelDates: {
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
        required: true,
      },
    },

    maritalStatus: {
      type: String,
      enum: ["single", "married"],
      required: true,
    },

    occupation: {
      type: String,
      enum: [
        "salaried",
        "self-employed",
        "student",
        "retired",
        "unemployed",
        "freelancer",
      ],
      required: true,
    },

    sponsorship: {
      type: String,
      enum: ["self", "family", "company"],
      required: true,
    },

    // 📄 Documents
    documents: {
      passportFront: {
        type: String,
        required: true,
      },
      passportBack: {
        type: String,
        required: true,
      },
      passportPhoto: {
        type: String,
        required: true,
      },
    },

    // Financial
    financialDetails: {
      employmentType: {
        type: String,
        enum: [
          "salaried",
          "self-employed",
          "student",
          "retired",
          "unemployed",
          "freelancer",
        ],
      },

      documents: [String], // flexible
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);