import Application from "../models/application.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import Checklist from "../models/checklist.model.js";


// CREATE
export const createApplication = async (req, res) => {
  try {
    const { userId } = req.body;

    const application = await Application.create({
      userId,
      status: "draft",
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL (USER)
export const getUserApplications = async (req, res) => {
  try {
    const { userId, phone, email } = req.query;
    const filter = {};
    const orClauses = [];

    if (userId) {
      orClauses.push({ userId });
    }

    if (phone) {
      orClauses.push({ phone });
    }

    if (email) {
      orClauses.push({ email });
    }

    if (orClauses.length > 0) {
      filter.$or = orClauses;
    }

    const applications = await Application.find(filter).sort({
      createdAt: -1,
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE
export const getSingleApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateApplication = async (req, res) => {
  try {
    const appId = req.params.id;

    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update only provided fields
    const fields = req.body;

    Object.keys(fields).forEach((key) => {
      application[key] = fields[key];
    });

    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteApplication = async (req, res) => {
  try {
    const { userId } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // ownership check
    if (application.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // only draft delete
    if (application.status !== "draft") {
      return res.status(400).json({
        message: "Only draft applications can be deleted",
      });
    }

    await application.deleteOne();

    res.json({ message: "Application deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });

    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const submitApplication = async (req, res) => {
//   try {
//     const app = await Application.findById(req.params.id);

//     if (!app) {
//       return res.status(404).json({ message: "Application not found" });
//     }

//     // 🔥 VALIDATION BEFORE SUBMIT

//     if (
//       !app.fullName ||
//       !app.age ||
//       !app.phone ||
//       !app.occupation ||
//       !app.sponsorship
//     ) {
//       return res.status(400).json({
//         message: "Please fill all traveller details",
//       });
//     }

//     if (
//       !app.documents?.passportFront ||
//       !app.documents?.passportBack ||
//       !app.documents?.passportPhoto
//     ) {
//       return res.status(400).json({
//         message: "Please upload all required documents",
//       });
//     }

//     if (!app.financialDetails?.documents?.length) {
//       return res.status(400).json({
//         message: "Please upload financial documents",
//       });
//     }

//     // 🔥 All good → submit
//     app.status = "submitted";

//     await app.save();

//     res.json({
//       message: "Application submitted successfully",
//       app,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const submitApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const normalizedOccupation = application.occupation === "employed" ? "salaried" : application.occupation;

    // STEP 1: get checklist
    const baseChecklist = await Checklist.findOne({
      country: application.country,
      category: "base",
    });

    const specificChecklist = await Checklist.findOne({
      country: application.country,
      category: normalizedOccupation,
    });

    const requiredItems = [
      ...(baseChecklist?.items || []),
      ...(specificChecklist?.items || []),
    ];

    // STEP 2: collect uploaded docs
    const uploadedDocs = [
      application.documents?.passportFront,
      application.documents?.passportBack,
      application.documents?.passportPhoto,
      ...(application.financialDetails?.documents || []),
    ].filter(Boolean);

    // STEP 3: VALIDATION
    if (uploadedDocs.length < requiredItems.length) {
      return res.status(400).json({
        message: "Missing required documents",
        required: requiredItems.length,
        uploaded: uploadedDocs.length,
      });
    }

    // STEP 4: submit
    application.status = "submitted";
    await application.save();

    res.json({
      message: "Application submitted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadDocuments = async (req, res) => {
  try {
    const appId = req.params.id;

    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 🔥 Upload files
    const passportFront = req.files.passportFront
      ? await uploadToCloudinary(req.files.passportFront[0])
      : null;

    const passportBack = req.files.passportBack
      ? await uploadToCloudinary(req.files.passportBack[0])
      : null;

    const passportPhoto = req.files.passportPhoto
      ? await uploadToCloudinary(req.files.passportPhoto[0])
      : null;

    let financialDocs = [];

    if (req.files.financialDocs) {
      for (let file of req.files.financialDocs) {
        const uploaded = await uploadToCloudinary(file);
        financialDocs.push(uploaded.secure_url);
      }
    }

    // 🔥 Save URLs
    if (passportFront)
      application.documents.passportFront = passportFront.secure_url;

    if (passportBack)
      application.documents.passportBack = passportBack.secure_url;

    if (passportPhoto)
      application.documents.passportPhoto = passportPhoto.secure_url;

    if (financialDocs.length > 0) {
      application.financialDetails.documents = financialDocs;
    }

    await application.save();

    res.json({
      message: "Documents uploaded successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addApplicationMessage = async (req, res) => {
  try {
    const appId = req.params.id;
    const { senderRole, senderName, text } = req.body;

    if (!senderRole || !text) {
      return res.status(400).json({ message: "senderRole and text are required" });
    }

    if (!["user", "admin"].includes(senderRole)) {
      return res.status(400).json({ message: "Invalid senderRole" });
    }

    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.messages.push({
      senderRole,
      senderName: senderName || "",
      text,
      createdAt: new Date(),
    });

    await application.save();

    return res.status(201).json({
      message: "Message added",
      application,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};