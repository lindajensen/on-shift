import { Router } from "express";
import {
  toggleAvailability,
  getWorkerProfile,
  getWorkerApplications,
  getRecommendedJobs,
} from "../controllers/workersController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/me", authenticateToken, getWorkerProfile);
router.get("/applications", authenticateToken, getWorkerApplications);
router.get("/recommended-jobs", authenticateToken, getRecommendedJobs);
router.patch("/availability", authenticateToken, toggleAvailability);

export default router;
