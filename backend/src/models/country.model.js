import mongoose from "mongoose";

const visaOptionSchema = new mongoose.Schema({
  visaType: {
    type: String,
    enum: ["e-visa", "visa-on-arrival", "visa-required", "visa-free"],
  },

  entryType: {
    type: String,
    enum: ["single-entry", "multiple-entry"],
  },

  price: Number,

  stayDuration: String,
  validity: String,
  processingTime: String,

  originalPrice: Number,
  abscondedPrice: Number,

  pricingNote: String,

  isCombo: {
    type: Boolean,
    default: false,
  },
});

const countrySchema = new mongoose.Schema(
  {
    countryName: {
      type: String,
      // required: true,
    },

    isoCode: String,
    flag: String,

    officialURL: String,

    showOnHomepage: {
      type: Boolean,
      default: false,
    },

    visaOptions: [visaOptionSchema], // 🔥 IMPORTANT
  },
  { timestamps: true }
);

export default mongoose.model("Country", countrySchema);