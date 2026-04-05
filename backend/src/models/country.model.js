import mongoose from "mongoose";

const visaOptionSchema = new mongoose.Schema(
  {
    visaType: String,
    entryType: String,
    price: Number,
    stayDuration: String,
    validity: String,
    processingTime: String,
    originalPrice: Number,
    abscondedPrice: Number,
    pricingNote: String,
    alertMessage: String,
    currency: String,
    fees: {
      absconding: String,
    },
    isCombo: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false, strict: false }
);

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