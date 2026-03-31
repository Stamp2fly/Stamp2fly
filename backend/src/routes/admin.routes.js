import express from "express";
import {
  getAllApplications,
  updateApplicationStatus,
} from "../controllers/admin.controller.js";

const router = express.Router();

// GET all applications
router.get("/applications", getAllApplications);

// UPDATE status
router.put("/applications/:id/status", updateApplicationStatus);

export default router;