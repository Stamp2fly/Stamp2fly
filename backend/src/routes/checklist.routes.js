import express from "express";
import {
  createChecklist,
  getChecklist,
  getAllChecklists,
  getChecklistByCountry,
  deleteChecklist,
} from "../controllers/checklist.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getChecklist);
router.get("/all", getAllChecklists);

router.get("/country/:countryId", protect, authorize("super_admin", "team"), getChecklistByCountry);
router.post("/", protect, authorize("super_admin", "team"), createChecklist);
router.delete("/:id", protect, authorize("super_admin", "team"), deleteChecklist);

export default router;