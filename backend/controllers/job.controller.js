import jobModel from "../models/job.model.js";
import companyModel from "../models/company.model.js";

/**
 * POST /jobs (Recruiter only)
 */
async function postJob(req, res) {
  try {
    const {
      title,
      description,
      requirements,
      location,
      vacancies,
      salary,
      jobType,
      companyId,
    } = req.body;

    const userId = req.user._id;

    if (
      !title ||
      !description ||
      !requirements ||
      !location ||
      vacancies === undefined ||
      salary === undefined ||
      !jobType ||
      !companyId
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (isNaN(salary) || salary <= 0) {
      return res.status(400).json({ message: "Salary must be positive." });
    }

    if (isNaN(vacancies) || vacancies < 0) {
      return res
        .status(400)
        .json({ message: "Vacancies must be a non-negative integer." });
    }

    const jobTypeLower = jobType.toLowerCase();
    const validJobTypes = ["full-time", "part-time", "contract", "internship"];

    if (!validJobTypes.includes(jobTypeLower)) {
      return res.status(400).json({ message: "Invalid job type." });
    }

    const company = await companyModel.findOne({
      _id: companyId,
      userId,
    });

    if (!company) {
      return res.status(403).json({
        message: "You are not authorized to post under this company.",
      });
    }

    // Split requirements by comma if it's a string
    const requirementsArray =
      typeof requirements === "string"
        ? requirements
            .split(",")
            .map((req) => req.trim())
            .filter(Boolean)
        : requirements;

    const job = await jobModel.create({
      title,
      description,
      requirements: requirementsArray,
      location,
      vacancies,
      salary,
      jobType: jobTypeLower,
      company: companyId,
      postedBy: userId,
    });

    return res.status(201).json({ message: "Job posted successfully", job });
  } catch (error) {
    console.error("Post job error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /jobs (Public)
 */
async function getAllJobs(req, res) {
  try {
    const keyword = req.query.keyword || "";
    const locationFilter = req.query.location || "";
    const jobTypeFilter = req.query.jobType || "";
    const salaryRangeFilter = req.query.salaryRange || "";

    const conditions = [];

    // Keyword search
    if (keyword) {
      conditions.push({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
          { location: { $regex: keyword, $options: "i" } },
          { jobType: { $regex: keyword, $options: "i" } },
          { requirements: { $regex: keyword, $options: "i" } },
        ],
      });
    }

    // Location filter
    if (locationFilter) {
      const locations = locationFilter.split(",").map((loc) => loc.trim());
      conditions.push({
        location: { $regex: locations.join("|"), $options: "i" },
      });
    }

    // Job type filter
    if (jobTypeFilter) {
      const jobTypes = jobTypeFilter
        .split(",")
        .map((type) => type.trim().toLowerCase());
      conditions.push({
        jobType: { $in: jobTypes },
      });
    }

    // Salary range filter
    if (salaryRangeFilter) {
      const ranges = salaryRangeFilter.split(",");
      const salaryConditions = [];

      ranges.forEach((range) => {
        if (range === "100000+") {
          salaryConditions.push({ salary: { $gte: 100000 } });
        } else if (range.includes("-")) {
          const [min, max] = range.split("-").map(Number);
          salaryConditions.push({ salary: { $gte: min, $lte: max } });
        }
      });

      if (salaryConditions.length > 0) {
        conditions.push({ $or: salaryConditions });
      }
    }

    const filter = conditions.length > 0 ? { $and: conditions } : {};

    const jobs = await jobModel
      .find(filter)
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({ jobs });
  } catch (error) {
    console.error("Get all jobs error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /jobs/:jobId (Public)
 */
async function getJobById(req, res) {
  try {
    const job = await jobModel
      .findById(req.params.jobId)
      .populate("company")
      .populate("postedBy", "-password")
      .populate({
        path: "applications",
        populate: { path: "applicant", select: "-password" },
        options: { sort: { createdAt: -1 } },
      });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ job });
  } catch (error) {
    console.error("Get job by ID error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /jobs/my (Recruiter-only)
 */
async function getJobsByAdmin(req, res) {
  try {
    const jobs = await jobModel
      .find({ postedBy: req.user._id })
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({ jobs });
  } catch (error) {
    console.error("Get jobs by admin error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * DELETE /jobs/:jobId (Recruiter-only)
 */
async function deleteJob(req, res) {
  try {
    const jobId = req.params.jobId;

    const job = await jobModel.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Only job owner can delete
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this job." });
    }

    await jobModel.findByIdAndDelete(jobId);

    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * PUT /jobs/:jobId (Recruiter-only)
 */
async function updateJob(req, res) {
  try {
    const jobId = req.params.jobId;
    const {
      title,
      description,
      requirements,
      location,
      vacancies,
      salary,
      jobType,
    } = req.body;

    const job = await jobModel.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Only job owner can update
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this job." });
    }

    // Update fields if provided
    if (title !== undefined) job.title = title;
    if (description !== undefined) job.description = description;
    if (requirements !== undefined) {
      job.requirements =
        typeof requirements === "string"
          ? requirements
              .split(",")
              .map((req) => req.trim())
              .filter(Boolean)
          : requirements;
    }
    if (location !== undefined) job.location = location;
    if (vacancies !== undefined) job.vacancies = vacancies;
    if (salary !== undefined) job.salary = salary;
    if (jobType !== undefined) job.jobType = jobType.toLowerCase();

    const updatedJob = await job.save();

    return res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update job error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export {
  postJob,
  getAllJobs,
  getJobById,
  getJobsByAdmin,
  deleteJob,
  updateJob,
};
