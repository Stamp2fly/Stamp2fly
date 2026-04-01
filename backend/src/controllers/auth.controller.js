import User from "../models/user.model.js";
import { generateOTP } from "../utils/generateOtp.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    let user = await User.findOne({ phone });

    const otp = generateOTP();

    if (!user) {
      user = new User({ phone });
    }
    // user.otp = otp;
    const hashedOtp = await bcrypt.hash(otp, 10);
    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; //10 mins
    await user.save();
    console.log(`OTP for ${phone} is ${otp}`); // In production, send this OTP via SMS using a service like Twilio
    res.json({ message: "OTP sent successfully" });
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

    console.log("Stored OTP:", user.otp);
    console.log("Entered OTP:", otp);
    console.log("Expiry:", user.otpExpiry, "Now:", Date.now());

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

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

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "SECRET_KEY",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "OTP verified successfully",
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};
