import Checklist from "../models/checklist.model.js";

const normalizeCategory = (category) => {
  if (!category) {
    return "base";
  }

  return category === "employed" ? "salaried" : category;
};

const denormalizeCategory = (category) => {
  if (!category) {
    return "base";
  }

  return category === "salaried" ? "employed" : category;
};

// CREATE or UPDATE
export const createChecklist = async (req, res) => {
  try {
    const { country, category, items } = req.body;
    const normalizedCategory = normalizeCategory(category);

    // check if already exists
    let checklist = await Checklist.findOne({ country, category: normalizedCategory });

    if (checklist) {
      checklist.items = items;
      await checklist.save();
    } else {
      checklist = await Checklist.create({ country, category: normalizedCategory, items });
    }

    res.json({
      ...checklist.toObject(),
      category: denormalizeCategory(checklist.category),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET checklist
export const getChecklist = async (req, res) => {
  try {
    const { country, category } = req.query;
    const normalizedCategory = normalizeCategory(category);

    const baseChecklist = await Checklist.findOne({
      country,
      category: "base",
    });

    const specificChecklist = await Checklist.findOne({
      country,
      category: normalizedCategory,
    });

    // merge base + specific
    const items = [
      ...(baseChecklist?.items || []),
      ...(specificChecklist?.items || []),
    ];

    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChecklistByCountry = async (req, res) => {
  try {
    const checklists = await Checklist.find({ country: req.params.countryId }).sort({ category: 1 });

    const grouped = checklists.reduce((accumulator, checklist) => {
      accumulator[denormalizeCategory(checklist.category)] = checklist.items || [];
      return accumulator;
    }, {});

    res.json({
      country: req.params.countryId,
      checklist: grouped,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllChecklists = async (_req, res) => {
  try {
    const checklists = await Checklist.find().populate("country", "countryName");

    res.json(
      checklists.map((item) => ({
        _id: item._id,
        countryId: item.country?._id || item.country,
        countryName: item.country?.countryName,
        category: denormalizeCategory(item.category),
        items: item.items || [],
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteChecklist = async (req, res) => {
  try {
    await Checklist.findByIdAndDelete(req.params.id);

    res.json({ message: "Checklist deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};