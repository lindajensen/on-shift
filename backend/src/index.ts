import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import workerRoutes from "./routes/workers";
import employerRoutes from "./routes/employers";
import jobsRoutes from "./routes/jobs";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api/jobs", jobsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
