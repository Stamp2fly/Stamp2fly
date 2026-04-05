import User from "../models/user.model.js";
import { generateOTP } from "../utils/generateOtp.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const normalizePhone = (phone) => String(phone || "").replace(/\D/g, "");

const getConfiguredSuperAdminPhones = () => {
  const raw = process.env.SUPER_ADMIN_PHONES || process.env.SUPER_ADMIN_PHONE || "";
  return raw
    .split(",")
    .map((value) => normalizePhone(value))
    .filter(Boolean);
};

const isConfiguredSuperAdminPhone = (phone) => {
  const normalizedInput = normalizePhone(phone);

  if (!normalizedInput) {
    return false;
  }

  const configuredPhones = getConfiguredSuperAdminPhones();

  return configuredPhones.some(
    (configured) =>
      normalizedInput === configured ||
      normalizedInput.endsWith(configured) ||
      configured.endsWith(normalizedInput)
  );
};

export const sendOtp = async (req, res) => {
  try {
    const { phone, fullName, authProvider = "phone", mode = "login" } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    let user = await User.findOne({ phone });
    const shouldBeSuperAdmin = isConfiguredSuperAdminPhone(phone);

    if (mode === "signup" && user) {
      return res.status(409).json({
        message: "This phone number is already registered. Please login instead.",
      });
    }

    const otp = generateOTP();

    if (!user) {
      user = new User({
        phone,
        fullName: fullName?.trim() || "",
        role: shouldBeSuperAdmin ? "super_admin" : "user",
        authProvider,
      });
    } else {
      if (fullName?.trim()) {
        user.fullName = fullName.trim();
      }
      if (authProvider) {
        user.authProvider = authProvider;
      }
      if (shouldBeSuperAdmin && user.role !== "super_admin") {
        user.role = "super_admin";
      }
    }
    // user.otp = otp;
    const hashedOtp = await bcrypt.hash(otp, 10);
    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; //10 mins
    await user.save();
    console.log(`OTP for ${phone} is ${otp}`); // In production, send this OTP via SMS using a service like Twilio

    const normalizedRole = String(user.role || "").toLowerCase().replace(/[\s-]+/g, "_");
    const isAdmin = normalizedRole === "super_admin" || normalizedRole === "team" || normalizedRole === "admin";

    res.json({
      message: "OTP sent successfully",
      role: user.role,
      isAdmin,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Verify OTP and generate JWT
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    console.log("Stored OTP:", user.otp);
    console.log("Entered OTP:", otp);
    console.log("Expiry:", user.otpExpiry, "Now:", Date.now());

    // Fix: type-safe comparison
    // if (String(user.otp) !== String(otp) || user.otpExpiry < Date.now()) {
    //   // console.log(res.status);
    //   console.log("couldn't make it further");
    //   return res.status(400).json({ message: "Invalid or expired OTP" });
    // }
    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Safety check at verification time to avoid stale role data.
    if (isConfiguredSuperAdminPhone(phone) && user.role !== "super_admin") {
      user.role = "super_admin";
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const normalizedRole = String(user.role || "").toLowerCase().replace(/[\s-]+/g, "_");
    const isAdmin = normalizedRole === "super_admin" || normalizedRole === "team" || normalizedRole === "admin";

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "SECRET_KEY",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "OTP verified successfully",
      token,
      user,
      isAdmin,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};
