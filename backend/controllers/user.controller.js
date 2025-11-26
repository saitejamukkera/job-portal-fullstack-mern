import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import cloudinary from "../utils/cloudinary.js";

// Cloudinary upload helper (stream-based)
function uploadToCloudinary(buffer, originalName, folder) {
  const clean = originalName.replace(/\s+/g, "_");

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          public_id: clean,
          use_filename: true,
          unique_filename: false,
          overwrite: true,
          resource_type: "raw",
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      )
      .end(buffer);
  });
}

// ---------------------------------------------------------------------------
// REGISTER
// ---------------------------------------------------------------------------
export async function register(req, res) {
  try {
    const { fullName, email, password, phoneNumber, role } = req.body;

    if (!fullName || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hash = await bcrypt.hash(password, 10);

    const userData = {
      fullName,
      email,
      password: hash,
      phoneNumber,
      role,
      profile: {
        bio: "",
        skills: [],
        companyApplied: [],
        profilePictureURL: "",
        profilePictureOriginalName: "",
        resumeURL: "",
        resumeOriginalName: "",
      },
    };

    // Profile picture upload
    const profilePic = req.files?.profilePicture?.[0];
    if (profilePic) {
      const upload = await uploadToCloudinary(
        profilePic.buffer,
        profilePic.originalname,
        "jobportal_profilepictures"
      );

      userData.profile.profilePictureURL = upload.secure_url;
      userData.profile.profilePictureOriginalName = profilePic.originalname;
    }

    // Resume upload
    const resume = req.files?.resume?.[0];
    if (resume) {
      const upload = await uploadToCloudinary(
        resume.buffer,
        resume.originalname,
        "jobportal_resumes"
      );

      userData.profile.resumeURL = upload.secure_url;
      userData.profile.resumeOriginalName = resume.originalname;
    }

    await userModel.create(userData);

    return res.status(201).json({
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// ---------------------------------------------------------------------------
// LOGIN
// ---------------------------------------------------------------------------
export async function login(req, res) {
  try {
    const { email, password, role } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user found." });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Invalid password." });
    }

    if (role !== user.role) {
      return res.status(400).json({ message: "Incorrect role selected." });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// ---------------------------------------------------------------------------
// UPDATE PROFILE
// ---------------------------------------------------------------------------
export async function updateUserProfile(req, res) {
  try {
    const userId = req.user._id;
    const { fullName, email, phoneNumber, bio, skills } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;

    if (skills) {
      user.profile.skills = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // Profile picture update
    const profilePic = req.files?.profilePicture?.[0];
    if (profilePic) {
      const upload = await uploadToCloudinary(
        profilePic.buffer,
        profilePic.originalname,
        "jobportal_profilepictures"
      );

      user.profile.profilePictureURL = upload.secure_url;
      user.profile.profilePictureOriginalName = profilePic.originalname;
    }

    // Resume update
    const resume = req.files?.resume?.[0];
    if (resume) {
      const upload = await uploadToCloudinary(
        resume.buffer,
        resume.originalname,
        "jobportal_resumes"
      );

      user.profile.resumeURL = upload.secure_url;
      user.profile.resumeOriginalName = resume.originalname;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Update profile error" });
  }
}
