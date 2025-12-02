import express from "express";

import {
  registerCompany,
  getCompaniesofUser,
  getCompanyById,
  updateCompany,
  deleteCompanyById,
} from "../controllers/company.controller.js";

import auth from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.js";
const router = express.Router();

// Create company
router.post("/register", auth, upload, registerCompany);

// Get all companies owned by logged-in user
router.get("/my", auth, getCompaniesofUser);

// Get single company by ID
router.get("/:companyId", auth, getCompanyById);

// Update company
router.put("/:companyId", auth, upload, updateCompany);

//Delete company

router.delete("/:companyId", auth, deleteCompanyById);

export default router;
