import jobModel from "../models/job.model.js";
import companyModel from "../models/company.model.js";

/**
 * POST /jobs  (Recruiter only)
 */
async function postJob(req, res) {
  try {
    const {
      title,
      description,
      requirements,
      location,
      salary,
      jobType,
      companyId,
    } = req.body;

    const userId = req.user._id;

    // Required fields validation
    if (
      !title ||
      !description ||
      !requirements ||
      !location ||
      !salary ||
      !jobType ||
      !companyId
    ) {
      return res.status(400).json({
        message: "All fields are required, including companyId.",
      });
    }

    // Salary must be positive
    if (isNaN(salary) || salary <= 0) {
      return res
        .status(400)
        .json({ message: "Salary must be a positive number." });
    }

    // Validate jobType
    const jobTypeLower = jobType.toLowerCase();
    const validJobTypes = ["full-time", "part-time", "contract", "internship"];

    if (!validJobTypes.includes(jobTypeLower)) {
      return res.status(400).json({ message: "Invalid job type." });
    }

    // Ensure company belongs to the logged-in recruiter
    const company = await companyModel.findOne({
      _id: companyId,
      userId: userId,
    });

    if (!company) {
      return res.status(403).json({
        message: "You are not authorized to post a job under this company.",
      });
    }

    // Create job
    const job = await jobModel.create({
      title,
      description,
      requirements,
      location,
      salary,
      jobType: jobTypeLower,
      postedBy: userId,
      company: companyId,
    });

    return res.status(201).json({
      message: "Job posted successfully",
      job,
    });
  } catch (error) {
    console.error("Post job error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

/**
 * GET /jobs  (Public)
 */
async function getAllJobs(req, res) {
  try {
    const keyword = req.query.keyword || "";

    let filter = {};

    if (keyword) {
      filter = {
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
          { location: { $regex: keyword, $options: "i" } },
          { jobType: { $regex: keyword, $options: "i" } },
          // Search inside requirements array
          { requirements: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    const jobs = await jobModel
      .find(filter)
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({ jobs });
  } catch (error) {
    console.error("Get all jobs error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

/**
 * GET /jobs/:jobId  (Public)
 */
async function getJobById(req, res) {
  try {
    const jobId = req.params.jobId;

    const job = await jobModel
      .findById(jobId)
      .populate("company")
      .populate("postedBy", "-password");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    return res.status(200).json({ job });
  } catch (error) {
    console.error("Get job by ID error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

/**
 * GET /jobs/my  (Recruiter-only)
 */
async function getJobsByAdmin(req, res) {
  try {
    const jobs = await jobModel
      .find({ postedBy: req.user._id })
      .populate("company")
      .populate("postedBy", "-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({ jobs });
  } catch (error) {
    console.error("Get jobs by admin error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

export { postJob, getAllJobs, getJobById, getJobsByAdmin };
