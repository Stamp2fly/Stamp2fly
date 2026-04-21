import express from "express";
import {
  createApplicationField,
  deleteApplicationField,
  getActiveApplicationFields,
  getAllApplicationFields,
  updateApplicationField,
} from "../controllers/applicationField.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getActiveApplicationFields);
router.get("/admin", protect, authorize("super_admin", "team"), getAllApplicationFields);
router.post("/admin", protect, authorize("super_admin", "team"), createApplicationField);
router.put("/admin/:id", protect, authorize("super_admin", "team"), updateApplicationField);
router.delete("/admin/:id", protect, authorize("super_admin", "team"), deleteApplicationField);

export default router;
