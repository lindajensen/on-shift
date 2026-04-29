import { Router } from "express";
import {
  getJobListings,
  getEmployerApplications,
  getSavedWorkers,
  getEmployerReviews,
  createJobListing,
  updateJobListing,
  deleteJobListing,
} from "../controllers/employersControllers";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/jobs", authenticateToken, getJobListings);
router.get("/applications", authenticateToken, getEmployerApplications);
router.get("/saved-workers", authenticateToken, getSavedWorkers);
router.get("/reviews", authenticateToken, getEmployerReviews);
router.post("/jobs", authenticateToken, createJobListing);
router.put("/jobs/:id", authenticateToken, updateJobListing);
router.delete("/jobs/:id", authenticateToken, deleteJobListing);

export default router;
