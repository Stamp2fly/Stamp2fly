import Checklist from "../models/checklist.model.js";

// CREATE or UPDATE
export const createChecklist = async (req, res) => {
  try {
    const { country, category, items } = req.body;

    // check if already exists
    let checklist = await Checklist.findOne({ country, category });

    if (checklist) {
      checklist.items = items;
      await checklist.save();
    } else {
      checklist = await Checklist.create({ country, category, items });
    }

    res.json(checklist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET checklist
export const getChecklist = async (req, res) => {
  try {
    const { country, category } = req.query;

    const baseChecklist = await Checklist.findOne({
      country,
      category: "base",
    });

    const specificChecklist = await Checklist.findOne({
      country,
      category,
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

// DELETE
export const deleteChecklist = async (req, res) => {
  try {
    await Checklist.findByIdAndDelete(req.params.id);

    res.json({ message: "Checklist deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};