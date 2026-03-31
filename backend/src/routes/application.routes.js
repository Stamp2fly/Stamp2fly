import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { uploadDocuments } from "../controllers/application.controller.js";
import {
  createApplication,
  getUserApplications,
  getSingleApplication,
  updateApplication,
  deleteApplication,
  submitApplication,
  getAllApplications,
//   uploadDocuments,
} from "../controllers/application.controller.js";

const router = express.Router();

// CREATE
router.post("/", createApplication);

// GET all (user)
router.get("/", getUserApplications);

// GET one
router.get("/:id", getSingleApplication);

// UPDATE
router.put("/:id", updateApplication);

// DELETE
router.delete("/:id", deleteApplication);

router.put("/:id/submit", submitApplication);
router.get("/admin/all", getAllApplications);

router.post(
  "/:id/upload",
  upload.fields([
    { name: "passportFront", maxCount: 1 },
    { name: "passportBack", maxCount: 1 },
    { name: "passportPhoto", maxCount: 1 },
    { name: "financialDocs", maxCount: 5 },
  ]),
  uploadDocuments
);

export default router;
