import Country from "../models/country.model.js";

// CREATE
export const createCountry = async (req, res) => {
  try {
    const country = await Country.create(req.body);

    res.status(201).json(country);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
export const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find().sort({ createdAt: -1 });

    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE
export const getSingleCountry = async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);

    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    res.json(country);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateCountry = async (req, res) => {
  try {
    const country = await Country.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    res.json(country);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteCountry = async (req, res) => {
  try {
    const country = await Country.findByIdAndDelete(req.params.id);

    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    res.json({ message: "Country deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};