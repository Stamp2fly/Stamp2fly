import mongoose from "mongoose";

const applicationFieldSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true, 
      trim: true,
      unique: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    section: {
      type: String,
      enum: ["travel", "financial"],
      default: "travel",
    },
    target: {
      type: String,
      enum: ["application", "traveler"],
      default: "application",
    },

    fieldType: {
      type: String,
      enum: ["text", "textarea", "number", "date", "select", "file", "email", "tel"],
    },

    // A list of selectable values for a field like select, dropdown, etc. For example, if fieldType is "select", then options could be ["Option 1", "Option 2", "Option 3"]
    options: {
      type: [String],
      default: [],
    },

    required: {
      type: Boolean,
      default: false,
    },

    // To add dynamic dependencies between fields (e.g., show this field only if another field has a specific value)
    // Made an array to allow for multiple dependencies, such as showing a field if either of two other fields has specific values
    dependsOn: [
      {
        fieldId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ApplicationField",
        },
        value: mongoose.Schema.Types.Mixed,
      },
    ],
    placeholder: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    isGlobal: {
      type: Boolean,
      default: true,
    },
    // Track whether the field is active or has been soft-deleted
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ApplicationField", applicationFieldSchema);
