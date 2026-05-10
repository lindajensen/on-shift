import { Router } from "express";
import {
  getWorkerProfileByUserId,
  getWorkerProfileById,
  updateWorkerProfile,
  updateWorkerExperience,
  updateWorkerEducation,
  updateWorkerRoles,
  updateWorkerAvailability,
  toggleAvailability,
  getWorkerProfile,
  getWorkerApplications,
  getRecommendedJobs,
  getWorkerReviews,
  getSavedJobs,
  saveJob,
  unsaveJob,
} from "../controllers/workersController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

//TODO: Refactor and delete
router.get("/me", authenticateToken, getWorkerProfile);

router.get("/profile/me", authenticateToken, getWorkerProfileByUserId);
router.patch("/profile/me", authenticateToken, updateWorkerProfile);
router.get("/profile/:id", getWorkerProfileById);
router.patch("/profile/experience", authenticateToken, updateWorkerExperience);
router.patch("/profile/education", authenticateToken, updateWorkerEducation);
router.patch("/profile/roles", authenticateToken, updateWorkerRoles);
router.patch(
  "/profile/availability",
  authenticateToken,
  updateWorkerAvailability,
);

router.get("/saved-jobs", authenticateToken, getSavedJobs);
router.post("/saved-jobs", authenticateToken, saveJob);
router.delete("/saved-jobs", authenticateToken, unsaveJob);

router.get("/applications", authenticateToken, getWorkerApplications);

router.get("/recommended-jobs", authenticateToken, getRecommendedJobs);

router.get("/reviews", authenticateToken, getWorkerReviews);

router.patch("/availability", authenticateToken, toggleAvailability);

export default router;
