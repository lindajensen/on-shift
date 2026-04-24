import { Router } from "express";
import {
  toggleAvailability,
  getWorkerProfile,
} from "../controllers/workersController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/me", authenticateToken, getWorkerProfile);
router.patch("/availability", authenticateToken, toggleAvailability);

export default router;
