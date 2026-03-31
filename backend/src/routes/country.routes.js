import express from "express";
import {
  createCountry,
  getAllCountries,
  getSingleCountry,
  updateCountry,
  deleteCountry,
} from "../controllers/country.controller.js";

const router = express.Router();

// CREATE
router.post("/", createCountry);

// GET ALL
router.get("/", getAllCountries);

// GET ONE
router.get("/:id", getSingleCountry);

// UPDATE
router.put("/:id", updateCountry);

// DELETE
router.delete("/:id", deleteCountry);

export default router;