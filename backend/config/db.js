import { MONGO_URI } from "../config.js";
import mongoose from "mongoose";

async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log("Error connecting with DB: " + err?.message);
    process.exit(1);
  }
}

export { connectDB };
