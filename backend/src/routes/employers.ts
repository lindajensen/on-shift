import { Router } from "express";
import {
  getEmployerProfileByUserId,
  getEmployerProfileById,
  updateEmployerContact,
  updateEmployerDescription,
  getJobListings,
  getJobDetails,
  getEmployerApplications,
  getAllWorkers,
  getRandomWorkers,
  getSavedWorkers,
  saveWorker,
  unsaveWorker,
  getEmployerReviews,
  getEmployerReviewsById,
  createEmployerReview,
  createJobListing,
  updateJobListing,
  closeJobListing,
  reopenJobListing,
  getPublicJobListings,
  hireApplicant,
  rejectApplicant,
} from "../controllers/employersControllers";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/profile/me", authenticateToken, getEmployerProfileByUserId);
router.patch("/profile/contact", authenticateToken, updateEmployerContact);
router.patch(
  "/profile/description",
  authenticateToken,
  updateEmployerDescription,
);
router.get("/profile/:id", getEmployerProfileById);
router.get("/profile/:id/jobs", authenticateToken, getPublicJobListings);
router.get("/profile/:id/reviews", getEmployerReviewsById);

router.get("/jobs", authenticateToken, getJobListings);
router.post("/jobs", authenticateToken, createJobListing);
router.get("/jobs/:id", authenticateToken, getJobDetails);
router.put("/jobs/:id", authenticateToken, updateJobListing);
router.patch("/jobs/:id/close", authenticateToken, closeJobListing);
router.patch("/jobs/:id/reopen", authenticateToken, reopenJobListing);

router.get("/applications", authenticateToken, getEmployerApplications);

router.get("/workers", authenticateToken, getAllWorkers);
router.get("/workers/random", getRandomWorkers);

router.get("/saved-workers", authenticateToken, getSavedWorkers);
router.post("/saved-workers", authenticateToken, saveWorker);
router.delete("/saved-workers", authenticateToken, unsaveWorker);

router.get("/reviews", authenticateToken, getEmployerReviews);
router.post("/reviews", authenticateToken, createEmployerReview);

router.patch("/applications/:id/hire", authenticateToken, hireApplicant);
router.patch("/applications/:id/reject", authenticateToken, rejectApplicant);

export default router;
