import { Router } from "express";
import { getAllJobs, getJobById } from "../controllers/jobsController";

const router = Router();

router.get("/", getAllJobs);
router.get("/:id", getJobById);

export default router;
