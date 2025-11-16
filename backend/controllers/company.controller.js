import companyModel from "../models/company.model.js";

// REGISTER COMPANY
async function registerCompany(req, res) {
  console.log("control is here");
  //await companyModel.collection.dropIndex("name_1");
  try {
    const { companyName, location, description, website } = req.body;

    // Required fields
    if (!companyName || !location) {
      return res
        .status(400)
        .json({ message: "Company name and location are required." });
    }

    // Check if company already exists
    const existingCompany = await companyModel.findOne({ companyName });
    if (existingCompany) {
      return res.status(400).json({ message: "Company already exists." });
    }

    // Create company
    const newCompany = await companyModel.create({
      companyName,
      location,
      description: description || "",
      website: website || "",
      userId: req.user._id,
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company: newCompany,
    });
  } catch (error) {
    console.error("Company registration error: ", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// GET COMPANIES OF LOGGED-IN USER
async function getCompaniesofUser(req, res) {
  try {
    const companies = await companyModel.find({ userId: req.user._id });

    return res.status(200).json({ companies });
  } catch (error) {
    console.error("Get companies error: ", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// GET COMPANY BY ID
async function getCompanyById(req, res) {
  try {
    const companyId = req.params.companyId;

    const company = await companyModel.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    return res.status(200).json({ company });
  } catch (error) {
    console.error("Get company by ID error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// UPDATE COMPANY
async function updateCompany(req, res) {
  try {
    const companyId = req.params.companyId;
    const { companyName, description, location, website } = req.body;
    const file = req.file;

    const company = await companyModel.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Prevent updating companies the user does not own
    if (company.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this company.",
      });
    }

    // SAFE UPDATES (consistent with schema)
    if (companyName !== undefined) company.companyName = companyName;
    if (description !== undefined) company.description = description;
    if (location !== undefined) company.location = location;
    if (website !== undefined) company.website = website;

    if (file) {
      company.logo = file.path; // Cloudinary
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

export { registerCompany, getCompaniesofUser, getCompanyById, updateCompany };
