import applicationModel from "../models/application.model.js";
import jobModel from "../models/job.model.js";
import userModel from "../models/user.model.js";

/**
 * POST /jobs/:jobId/apply  (Applicant only)
 */
async function applyJob(req, res) {
  try {
    const jobId = req.params.jobId;
    const userId = req.user._id;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    // Check if user has a resume uploaded
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.profile?.resumeURL || user.profile.resumeURL.trim() === "") {
      return res.status(400).json({
        message: "Please upload your resume before applying for jobs",
        requiresResume: true,
      });
    }

    // Check if the job exists
    const job = await jobModel.findById(jobId).populate("company");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user already applied
    const existingApplication = await applicationModel.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    // Create new application
    const newApplication = await applicationModel.create({
      job: jobId,
      applicant: userId,
    });

    // Add to job document
    job.applications.push(newApplication._id);
    await job.save();

    // Add company to user's companyApplied array (if not already present)
    const companyId = job.company._id;
    if (!user.profile.companyApplied.includes(companyId)) {
      user.profile.companyApplied.push(companyId);
      await user.save();
    }

    const updatedJob = await jobModel.findById(jobId).populate({
      path: "applications",
      populate: {
        path: "applicant",
        select: "-password",
      },
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication,
      job: updatedJob,
    });
  } catch (error) {
    console.error("Apply job error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

/**
 * GET /applications/my  (Applicant only)
 */
async function getAppliedJobs(req, res) {
  try {
    const userId = req.user._id;

    const applications = await applicationModel
      .find({ applicant: userId })
      .populate({
        path: "job",
        populate: {
          path: "company",
          model: "Company",
        },
      })
      .sort({ createdAt: -1 });

    if (applications.length === 0) {
      return res.status(404).json({
        message: "No applications found",
      });
    }

    return res.status(200).json({ applications });
  } catch (error) {
    console.error("Get applied jobs error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

/**
 * GET /jobs/:jobId/applicants  (Recruiter only)
 */
async function getApplicantsForJob(req, res) {
  try {
    const jobId = req.params.jobId;

    const job = await jobModel.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: { path: "applicant", select: "-password" },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Ensure recruiter owns the job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to view applicants for this job",
      });
    }

    return res.status(200).json({
      applicants: job.applications,
    });
  } catch (error) {
    console.error("Get applicants for job error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

/**
 * PATCH /applications/:applicationId/status  (Recruiter only)
 */
async function updateApplicationStatus(req, res) {
  try {
    const { status } = req.body;
    const applicationId = req.params.applicationId;

    if (!status) {
      return res.status(400).json({ message: "Status is required!" });
    }

    const validStatuses = ["pending", "accepted", "rejected"];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const application = await applicationModel.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Ensure recruiter owns the job
    const job = await jobModel.findById(application.job);
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this application",
      });
    }

    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Status updated successfully",
      application,
    });
  } catch (error) {
    console.error("Application update error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

export {
  applyJob,
  getAppliedJobs,
  getApplicantsForJob,
  updateApplicationStatus,
};
