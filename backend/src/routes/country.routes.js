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

// CREATE
// router.post("/", createCountry);

// // GET ALL
// router.get("/", getAllCountries);

// // GET ONE
// router.get("/:id", getSingleCountry);

// // UPDATE
// router.put("/:id", updateCountry);

// // DELETE
// router.delete("/:id", deleteCountry);

router.post("/", protect, authorize("super_admin", "team"), createCountry);
router.put("/:id", protect, authorize("super_admin", "team"), updateCountry);
router.delete("/:id", protect, authorize("super_admin", "team"), deleteCountry);

export default router;