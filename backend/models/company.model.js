import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    logoURL: {
      type: String, //from cloudinary
      default: "",
    },
    logoOriginalName: {
      type: String,
      default: "",
    },
    website: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const companyModel = mongoose.model("Company", companySchema);

export default companyModel;
