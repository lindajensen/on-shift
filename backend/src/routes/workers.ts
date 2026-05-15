import { Router } from "express";
import {
  getWorkerProfileByUserId,
  getWorkerProfileById,
  updateWorkerContact,
  updateWorkerBio,
  updateWorkerExperience,
  updateWorkerEducation,
  updateWorkerRoles,
  updateWorkerAvailability,
  toggleAvailability,
  getWorkerProfile,
  getWorkerApplications,
  deleteApplication,
  getRecommendedJobs,
  getWorkerReviews,
  getSavedJobs,
  saveJob,
  unsaveJob,
  getSavedEmployers,
  saveEmployer,
  unsaveEmployer,
} from "../controllers/workersController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

//TODO: Refactor and delete
router.get("/me", authenticateToken, getWorkerProfile);

router.get("/profile/me", authenticateToken, getWorkerProfileByUserId);
router.get("/profile/:id", getWorkerProfileById);

router.patch("/profile/contact", authenticateToken, updateWorkerContact);
router.patch("/profile/bio", authenticateToken, updateWorkerBio);
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
router.delete("/applications/:id", authenticateToken, deleteApplication);

router.get("/recommended-jobs", authenticateToken, getRecommendedJobs);

router.get("/saved-employers", authenticateToken, getSavedEmployers);
router.post("/saved-employers", authenticateToken, saveEmployer);
router.delete("/saved-employers", authenticateToken, unsaveEmployer);

router.get("/reviews", authenticateToken, getWorkerReviews);

router.patch("/availability", authenticateToken, toggleAvailability);

export default router;
