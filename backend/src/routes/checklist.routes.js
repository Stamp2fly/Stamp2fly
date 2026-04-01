import express from "express";
import {
  createChecklist,
  getChecklist,
  deleteChecklist,
} from "../controllers/checklist.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// CREATE / UPDATE
// router.post("/", createChecklist);

// // GET (based on country + category)
// router.get("/", getChecklist);

// // DELETE
// router.delete("/:id", deleteChecklist);

router.get("/", protect, authorize("super_admin"), getChecklist);
router.post("/", protect, authorize("super_admin"), createChecklist);
router.delete("/:id", protect, authorize("super_admin"), deleteChecklist);

export default router;