import ApplicationField from "../models/applicationField.model.js";

// 🔧 Normalize + clean input
const normalizePayload = (payload = {}) => {
  const key = String(payload.key || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  return {
    key,
    label: payload.label?.trim(),
    country: payload.isGlobal === true || payload.isGlobal === "true" ? undefined : payload.country,
    section: payload.section || "travel",
    target: payload.target || "application",
    fieldType: payload.fieldType,
    required: Boolean(payload.required),
    placeholder: payload.placeholder || "",
    isGlobal: payload.isGlobal === true || payload.isGlobal === "true",
    options: Array.isArray(payload.options)
      ? payload.options.map((item) => String(item).trim()).filter(Boolean)
      : [],
    accept: payload.accept || ".pdf,.jpg,.jpeg,.png",
    multiple: Boolean(payload.multiple),
    order: Number.isFinite(Number(payload.order)) ? Number(payload.order) : 0,
    isActive: payload.isActive !== false,
    dependsOn: Array.isArray(payload.dependsOn)
      ? payload.dependsOn
      : payload.dependsOn
        ? [payload.dependsOn]
        : [],
  };
};

// ✅ GET ACTIVE FIELDS (WITH COUNTRY FILTER)
export const getActiveApplicationFields = async (req, res) => {
  try {
    const { countryId } = req.query;

    const query = countryId
      ? {
          isActive: true,
          $or: [
            { country: countryId },
            { isGlobal: true },
            { country: { $exists: false } },
            { country: null },
          ],
        }
      : { isActive: true };

    const fields = await ApplicationField.find(query)
      .sort({ section: 1, order: 1, createdAt: 1 })
      .lean();

    res.json(fields);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL FIELDS (ADMIN)
export const getAllApplicationFields = async (_req, res) => {
  try {
    const fields = await ApplicationField.find()
      .sort({ section: 1, order: 1, createdAt: 1 })
      .lean();

    res.json(fields);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ CREATE FIELD
export const createApplicationField = async (req, res) => {
  try {
    const payload = normalizePayload(req.body);

    // 🔥 Required validations
    if (
      !payload.key ||
      !payload.label ||
      !payload.fieldType
    ) {
      return res.status(400).json({
        message: "key, label, fieldType are required",
      });
    }
    if (!payload.isGlobal && !payload.country) {
      return res.status(400).json({
        message: "country is required unless field is global",
      });
    }
    // 🔥 Select must have options
    if (payload.fieldType === "select" && payload.options.length === 0) {
      return res.status(400).json({
        message: "Select fields must have options",
      });
    }

    // 🔥 Prevent duplicate keys per country
    const existing = await ApplicationField.findOne({
      key: payload.key,
      country: payload.country,
    });

    if (existing) {
      return res.status(400).json({
        message: "Field with this key already exists for this country",
      });
    }

    const created = await ApplicationField.create(payload);

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE FIELD
export const updateApplicationField = async (req, res) => {
  try {
    const payload = normalizePayload(req.body);

    if (
      !payload.key ||
      !payload.label ||
      !payload.fieldType
    ) {
      return res.status(400).json({
        message: "key, label, fieldType are required",
      });
    }
    
    if (!payload.isGlobal && !payload.country) {
      return res.status(400).json({
        message: "country is required unless field is global",
      });
    }

    if (payload.fieldType === "select" && payload.options.length === 0) {
      return res.status(400).json({
        message: "Select fields must have options",
      });
    }

    // 🔥 Prevent duplicate key (except itself)
    const existing = await ApplicationField.findOne({
      key: payload.key,
      country: payload.country,
      _id: { $ne: req.params.id },
    });

    if (existing) {
      return res.status(400).json({
        message: "Another field with this key already exists",
      });
    }

    const updated = await ApplicationField.findByIdAndUpdate(
      req.params.id,
      { $set: payload },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Field not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE FIELD
export const deleteApplicationField = async (req, res) => {
  try {
    const removed = await ApplicationField.findByIdAndDelete(req.params.id);

    if (!removed) {
      return res.status(404).json({ message: "Field not found" });
    }

    res.json({ message: "Field deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
