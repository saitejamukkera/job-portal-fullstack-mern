import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["applicant", "recruiter"],
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: { type: [String], default: [] },
      resumeURL: { type: String, default: "" },
      resumeOriginalName: { type: String, default: "NoName.pdf" },
      companyApplied: [
        {
          //Add multiple companies applied for later
          type: mongoose.Schema.Types.ObjectId,
          ref: "Company",
        },
      ],
      profilePictureURL: { type: String, default: "" },
      profilePictureOriginalName: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
