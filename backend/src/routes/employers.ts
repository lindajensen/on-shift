import { Router } from "express";
import {
  getJobListings,
  getEmployerApplications,
} from "../controllers/employersControllers";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/jobs", authenticateToken, getJobListings);
router.get("/applications", authenticateToken, getEmployerApplications);

export default router;
