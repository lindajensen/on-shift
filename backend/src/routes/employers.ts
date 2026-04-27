import { Router } from "express";
import {
  getJobListings,
  getEmployerApplications,
  getSavedWorkers,
} from "../controllers/employersControllers";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/jobs", authenticateToken, getJobListings);
router.get("/applications", authenticateToken, getEmployerApplications);
router.get("/saved-workers", authenticateToken, getSavedWorkers);

export default router;
