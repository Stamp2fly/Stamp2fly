import User from "../models/user.model.js";
import Application from "../models/application.model.js";

// GET ALL APPLICATIONS
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({
      createdAt: -1,
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE STATUS
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatus = [
      "draft",
      "submitted",
      "in-review",
      "approved",
      "rejected",
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }
    
    if (!req.body || !req.body.status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.json({
      message: "Status updated",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createAdminUser = async (req, res) => {
  try {
    const { fullName, fullname, email, phone, role = "team" } = req.body;

    const normalizedFullName = fullName || fullname || "";

    const user = await User.create({
      fullName: normalizedFullName,
      email,
      phone,
      role,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select("-otp -otpExpiry");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET DASHBOARD STATS
export const getDashboardStats = async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const activeUsers = await User.countDocuments({ role: "user" });
    const teamMembers = await User.countDocuments({ role: "team" });
    
    // Get status breakdown
    const statusBreakdown = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Get recent applications
    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("_id fullName country status createdAt");

    // Calculate summary stats
    const approvedCount = statusBreakdown.find(s => s.status === "approved")?.count || 0;
    const inProgressCount = statusBreakdown.find(s => s.status === "in-review")?.count || 0;
    const actionNeededCount = statusBreakdown.find(s => s.status === "submitted")?.count || 0;
    const rejectedCount = statusBreakdown.find(s => s.status === "rejected")?.count || 0;

    res.json({
      totalApplications,
      activeUsers,
      teamMembers,
      statusBreakdown: [
        { name: "Approved", value: approvedCount },
        { name: "In Progress", value: inProgressCount },
        { name: "Action Needed", value: actionNeededCount },
        { name: "Rejected", value: rejectedCount },
      ],
      recentApplications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted", userId: id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};