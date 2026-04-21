import admin from "../utils/firebaseAdmin.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const firebaseLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Firebase token is required" });
    }

    const decoded = await admin.auth().verifyIdToken(token);

    const phone = decoded.phone_number?.replace("+91", "");
    const email = decoded.email;
    const googleId = decoded.firebase?.sign_in_provider === "google.com" ? decoded.uid : undefined;
    const fullName = decoded.name || "User";

    const userLookup = [];
    if (phone) userLookup.push({ phone });
    if (email) userLookup.push({ email });
    if (googleId) userLookup.push({ googleId });

    let user = null;
    if (userLookup.length > 0) {
      user = await User.findOne({ $or: userLookup });
    }

    
    if (!user) {
      user = await User.create({
        phone,
        email,
        googleId,
        fullName,
        authProvider: decoded.firebase?.sign_in_provider === "google.com" ? "google" : "phone",
      });
    } else {
      // Update existing user logic...
      user.phone = user.phone || phone;
      user.email = user.email || email;
      await user.save();
    }
    
    // ✅ FIXED: Log after the user is actually found/defined
    console.log("User found in DB:", user);
    const jwtToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token: jwtToken,
      user,
    });

  } catch (error) {
    // ✅ PRO TIP: Always log the actual error so you know WHY it failed
    console.error("FIREBASE AUTH ERROR:", error); 
    res.status(401).json({ message: "Invalid or expired Firebase token" });
  }
};