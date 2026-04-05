import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  replaceFaqCollection,
} from "../controllers/faq.controller.js";

const router = express.Router();

router.get("/", getFaqs);
router.post("/", protect, authorize("super_admin", "team"), createFaq);
router.put("/:id", protect, authorize("super_admin", "team"), updateFaq);
router.delete("/:id", protect, authorize("super_admin", "team"), deleteFaq);
router.post("/replace", protect, authorize("super_admin", "team"), replaceFaqCollection);

export default router;
