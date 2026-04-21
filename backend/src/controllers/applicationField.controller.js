import ApplicationField from "../models/applicationField.model.js";

const normalizePayload = (payload = {}) => {
  const key = String(payload.key || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  return {
    key,
    label: payload.label,
    section: payload.section,
    target: payload.target,
    fieldType: payload.fieldType,
    required: Boolean(payload.required),
    placeholder: payload.placeholder || "",
    helpText: payload.helpText || "",
    options: Array.isArray(payload.options)
      ? payload.options.map((item) => String(item).trim()).filter(Boolean)
      : [],
    accept: payload.accept || ".pdf,.jpg,.jpeg,.png",
    multiple: Boolean(payload.multiple),
    order: Number.isFinite(Number(payload.order)) ? Number(payload.order) : 0,
    isActive: payload.isActive !== false,
  };
};

export const getActiveApplicationFields = async (_req, res) => {
  try {
    const fields = await ApplicationField.find({ isActive: true })
      .sort({ section: 1, order: 1, createdAt: 1 })
      .lean();

    res.json(fields);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

export const createApplicationField = async (req, res) => {
  try {
    const payload = normalizePayload(req.body);

    if (!payload.key || !payload.label || !payload.fieldType) {
      return res
        .status(400)
        .json({ message: "key, label and fieldType are required" });
    }

    const created = await ApplicationField.create(payload);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationField = async (req, res) => {
  try {
    const payload = normalizePayload(req.body);

    if (!payload.key || !payload.label || !payload.fieldType) {
      return res
        .status(400)
        .json({ message: "key, label and fieldType are required" });
    }

    const updated = await ApplicationField.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Field not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteApplicationField = async (req, res) => {
  try {
    const removed = await ApplicationField.findByIdAndDelete(req.params.id);

    if (!removed) {
      return res.status(404).json({ message: "Field not found" });
    }

    res.json({ message: "Field deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
