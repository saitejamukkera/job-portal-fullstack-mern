import express from "express";

import {
  registerCompany,
  getCompaniesofUser,
  getCompanyById,
  updateCompany,
} from "../controllers/company.controller.js";

import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create company
router.post("/register", auth, registerCompany);

// Get all companies owned by logged-in user
router.get("/my", auth, getCompaniesofUser);

// Get single company by ID
router.get("/:companyId", auth, getCompanyById);

// Update company
router.put("/:companyId", auth, updateCompany);

export default router;
