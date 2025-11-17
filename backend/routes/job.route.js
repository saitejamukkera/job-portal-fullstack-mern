import express from "express";
import {
  postJob,
  getAllJobs,
  getJobById,
  getJobsByAdmin,
} from "../controllers/job.controller.js";

import auth from "../middlewares/authMiddleware.js";
import isRecruiter from "../middlewares/isRecruiter.js";

const router = express.Router();

/**
 * PUBLIC ROUTES
 * ----------------------------
 * Anyone can view jobs or details
 */

// Get all jobs
router.get("/", getAllJobs);

// Get a job by ID
router.get("/:jobId", getJobById);

/**
 * RECRUITER ROUTES
 * ----------------------------
 * Only recruiters can post jobs or view their job dashboard
 */

// Post a new job
router.post("/", auth, isRecruiter, postJob);

// Get jobs posted by logged-in recruiter
router.get("/my/jobs", auth, isRecruiter, getJobsByAdmin);

export default router;
