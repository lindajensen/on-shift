import express, { Request, Response } from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import workerRoutes from "./routes/workers";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/workers", workerRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
