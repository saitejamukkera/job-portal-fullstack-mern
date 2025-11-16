import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { connectDB } from "./config/db.js";

//Importing Routes
import userRoutes from "./routes/user.route.js";
import companyRoutes from "./routes/company.route.js";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(morgan("dev"));

const PORT = process.env.PORT || 8080;

//Using Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/company", companyRoutes);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is listening on port ${PORT}`);
});
