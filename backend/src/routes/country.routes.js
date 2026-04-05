import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";

import {
  createCountry,
  getAllCountries,
  getSingleCountry,
  updateCountry,
  deleteCountry,
} from "../controllers/country.controller.js";

const router = express.Router();

router.get("/", getAllCountries);
router.get("/:id", getSingleCountry);

router.post("/", protect, authorize("super_admin", "team"), createCountry);
router.put("/:id", protect, authorize("super_admin", "team"), updateCountry);
router.delete("/:id", protect, authorize("super_admin", "team"), deleteCountry);

export default router;