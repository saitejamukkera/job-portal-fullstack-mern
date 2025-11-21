import express from "express";
import {
  register,
  login,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { singleUpload } from "../middlewares/multer.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", singleUpload, register);
router.post("/login", login);
router.put("/profile/update", auth, updateUserProfile);

export default router;
