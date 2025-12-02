import companyModel from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";

// -------------------------------
// Cloudinary Upload Helper (same style as user controller)
// -------------------------------
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
          resource_type: "image",
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      )
      .end(buffer);
  });
}

// =======================================================
// REGISTER COMPANY
// =======================================================
async function registerCompany(req, res) {
  try {
    const { companyName, location, description, website } = req.body;

    if (!companyName) {
      return res.status(400).json({ message: "Company name is required." });
    }

    const exists = await companyModel.findOne({ companyName });
    if (exists) {
      return res.status(400).json({ message: "Company already exists." });
    }

    let logoURL = "";
    let logoOriginalName = "";

    // Logo upload (Cloudinary)
    const logoFile = req.files?.logo?.[0];
    if (logoFile) {
      const upload = await uploadToCloudinary(
        logoFile.buffer,
        logoFile.originalname,
        "company_logos"
      );

      logoURL = upload.secure_url;
      logoOriginalName = logoFile.originalname;
    }

    const company = await companyModel.create({
      companyName,
      location,
      description: description || "",
      website: website || "",
      userId: req.user._id,
      logoURL,
      logoOriginalName,
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company,
    });
  } catch (error) {
    console.error("Company registration error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// =======================================================
// GET COMPANIES OF LOGGED-IN USER
// =======================================================
async function getCompaniesofUser(req, res) {
  try {
    const companies = await companyModel.find({ userId: req.user._id });
    return res.status(200).json({ companies });
  } catch (error) {
    console.error("Get companies error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// =======================================================
// GET SINGLE COMPANY BY ID
// =======================================================
async function getCompanyById(req, res) {
  try {
    const companyId = req.params.companyId;
    const company = await companyModel.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    return res.status(200).json({ company });
  } catch (error) {
    console.error("Get company by ID error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// =======================================================
// UPDATE COMPANY (matches user profile update style)
// =======================================================
async function updateCompany(req, res) {
  try {
    const companyId = req.params.companyId;
    const { companyName, description, location, website } = req.body;

    const company = await companyModel.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Only owner can update
    if (company.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this company.",
      });
    }

    // Safe updates
    if (companyName !== undefined) company.companyName = companyName;
    if (description !== undefined) company.description = description;
    if (location !== undefined) company.location = location;
    if (website !== undefined) company.website = website;

    // Logo update via Cloudinary
    const logoFile = req.files?.logo?.[0];
    if (logoFile) {
      const upload = await uploadToCloudinary(
        logoFile.buffer,
        logoFile.originalname,
        "company_logos"
      );

      company.logoURL = upload.secure_url;
      company.logoOriginalName = logoFile.originalname;
    }

    const updatedCompany = await company.save();

    return res.status(200).json({
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Update company error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function deleteCompanyById(req, res) {
  try {
    const companyId = req.params.companyId;
    const company = await companyModel.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    // Only owner can delete
    if (company.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this company.",
      });
    }
    await companyModel.findByIdAndDelete(companyId);
    return res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Delete company error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export {
  registerCompany,
  getCompaniesofUser,
  getCompanyById,
  updateCompany,
  deleteCompanyById,
};
