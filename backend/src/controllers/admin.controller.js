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
