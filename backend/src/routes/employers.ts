import { Router } from "express";
import {
  getJobListings,
  getJobDetails,
  getEmployerApplications,
  getAllWorkers,
  getSavedWorkers,
  getEmployerReviews,
  createJobListing,
  updateJobListing,
  closeJobListing,
  reopenJobListing,
} from "../controllers/employersControllers";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/jobs", authenticateToken, getJobListings);
router.get("/jobs/:id", authenticateToken, getJobDetails);
router.get("/applications", authenticateToken, getEmployerApplications);
router.get("/workers", authenticateToken, getAllWorkers);
router.get("/saved-workers", authenticateToken, getSavedWorkers);
router.get("/reviews", authenticateToken, getEmployerReviews);
router.post("/jobs", authenticateToken, createJobListing);
router.put("/jobs/:id", authenticateToken, updateJobListing);
router.patch("/jobs/:id/close", authenticateToken, closeJobListing);
router.patch("/jobs/:id/reopen", authenticateToken, reopenJobListing);

export default router;
