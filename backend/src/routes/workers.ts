import { Router } from "express";
import {
  toggleAvailability,
  getWorkerProfile,
  getWorkerApplications,
  getRecommendedJobs,
  getWorkerReviews,
  saveJob,
  unsaveJob,
} from "../controllers/workersController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/me", authenticateToken, getWorkerProfile);
router.get("/applications", authenticateToken, getWorkerApplications);
router.get("/recommended-jobs", authenticateToken, getRecommendedJobs);
router.get("/reviews", authenticateToken, getWorkerReviews);
router.post("/saved-jobs", authenticateToken, saveJob);
router.delete("/saved-jobs/:id", authenticateToken, unsaveJob);

router.patch("/availability", authenticateToken, toggleAvailability);

export default router;
