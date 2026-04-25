import { Router } from "express";
import { getJobListings } from "../controllers/employersControllers";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/jobs", authenticateToken, getJobListings);

export default router;
