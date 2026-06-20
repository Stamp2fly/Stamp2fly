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
router.delete(
  "/users/:id",
  protect,
  authorize("super_admin"),
  // delete admin/user by id
  async (req, res, next) => {
    // delegate to controller's deleteAdminUser if available
    try {
      // lazy-load controller to avoid circular import issues
      const { deleteAdminUser } = await import("../controllers/admin.controller.js");
      return deleteAdminUser(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);
router.get(
  "/users",
  protect,
  authorize("super_admin"),
  getAllUsers
);
export default router;