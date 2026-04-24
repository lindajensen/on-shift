import { Router } from "express";
import {
  toggleAvailability,
  getWorkerProfile,
  getWorkerApplications,
} from "../controllers/workersController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/me", authenticateToken, getWorkerProfile);
router.get("/applications", authenticateToken, getWorkerApplications);
router.patch("/availability", authenticateToken, toggleAvailability);

export default router;
