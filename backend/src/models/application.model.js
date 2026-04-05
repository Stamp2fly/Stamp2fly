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
      // required: true,
    },

    age: {
      type: Number,
      // required: true,
    },

    phone: {
      type: String,
      // required: true,
    },

    email: String,

    country: {
      type: String,
      default: "",
    },

    travelDates: {
      from: {
        type: Date,
        // required: true,
      },
      to: {
        type: Date,
        // required: true,
      },
    },

    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
      // required: true,
    },

    occupation: {
      type: String,
      enum: [
        "employed",
        "salaried",
        "self-employed",
        "student",
        "retired",
        "unemployed",
        "freelancer",
      ],
      // required: true,
    },

    sponsorship: {
      type: String,
      enum: ["self", "family", "company", "sponsored"],
      // required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "authorized", "captured", "failed", "refunded"],
      default: "pending",
    },

    paymentInfo: {
      provider: {
        type: String,
        default: "dummy",
      },
      transactionId: {
        type: String,
        default: "",
      },
      amount: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
      paidAt: {
        type: Date,
      },
    },

    // 📄 Documents
    documents: {
      passportFront: {
        type: String,
        // required: true,
      },
      passportBack: {
        type: String,
        // required: true,
      },
      passportPhoto: {
        type: String,
        // required: true,
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

    messages: [
      {
        senderRole: {
          type: String,
          enum: ["user", "admin"],
          required: true,
        },
        senderName: {
          type: String,
          default: "",
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);