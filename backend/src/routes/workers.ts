import { Router } from "express";
import multer from "multer";

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
  getWorkerApplications,
  deleteApplication,
  getRecommendedJobs,
  getWorkerReviews,
  getWorkerReviewsById,
  createReview,
  getSavedJobs,
  saveJob,
  unsaveJob,
  getSavedEmployers,
  saveEmployer,
  unsaveEmployer,
  uploadCV,
  generateSignedCVUrl,
  deleteCV,
  applyForJob,
} from "../controllers/workersController";
import { authenticateToken } from "../middleware/auth";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/profile/me", authenticateToken, getWorkerProfileByUserId);
router.get("/profile/:id", getWorkerProfileById);
router.get("/profile/:id/reviews", getWorkerReviewsById);

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
router.post("/reviews", authenticateToken, createReview);

router.patch("/availability", authenticateToken, toggleAvailability);

router.post("/cv", authenticateToken, upload.single("cv"), uploadCV);
router.get("/cv/url", authenticateToken, generateSignedCVUrl);
router.delete("/cv", authenticateToken, deleteCV);

router.post("/applications", authenticateToken, applyForJob);

export default router;
