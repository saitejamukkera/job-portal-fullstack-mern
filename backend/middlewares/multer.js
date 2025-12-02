import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({ storage }).fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "resume", maxCount: 1 },
  { name: "logo", maxCount: 1 },
]);
