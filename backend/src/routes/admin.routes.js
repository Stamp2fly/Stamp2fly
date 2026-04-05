import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";

import {
  getAllApplications,
  updateApplicationStatus,
  createAdminUser,
  getAllUsers,
  getDashboardStats,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get(
  "/dashboard-stats",
  protect,
  authorize("super_admin", "team"),
  getDashboardStats
);

router.get(
  "/applications",
  protect,
  authorize("super_admin", "team"),
  getAllApplications
);

router.put(
  "/applications/:id/status",
  protect,
  authorize("super_admin", "team"),
  updateApplicationStatus
);

router.post(
  "/users",
  protect,
  authorize("super_admin"),
  createAdminUser
);
router.get(
  "/users",
  protect,
  authorize("super_admin"),
  getAllUsers
);
export default router;