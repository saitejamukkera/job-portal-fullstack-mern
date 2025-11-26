import express from "express";
import {
  register,
  login,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", upload, register);
router.post("/login", login);
router.put("/profile/update", auth, upload, updateUserProfile);

export default router;
