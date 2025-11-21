import multer from "multer";

const storage = multer.memoryStorage(); // file in memory

export const singleUpload = multer({ storage }).single("profilePic");
