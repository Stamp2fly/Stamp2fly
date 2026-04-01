import express from "express";
import { sendOtp, verifyOtp } from "../controllers/auth.controller.js";
// import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
// router.get("/applications", protect, getAllApplications);

export default router;