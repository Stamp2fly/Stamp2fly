import FAQ from "../models/faq.model.js";

const normalizeFaq = (faq) => ({
  _id: faq._id,
  question: faq.question,
  answer: faq.answer,
  tags: faq.tags || [],
  countryId: faq.countryId,
  isGlobal: faq.isGlobal,
  order: faq.order,
});

export const getFaqs = async (req, res) => {
  try {
    const { countryId, isGlobal } = req.query;

    const query = {};

    if (typeof isGlobal !== "undefined") {
      query.isGlobal = String(isGlobal) === "true";
    }

    if (countryId) {
      query.countryId = countryId;
    }

    const faqs = await FAQ.find(query).sort({ order: 1, createdAt: 1 });

    res.json(faqs.map(normalizeFaq));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFaq = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json(normalizeFaq(faq));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.json(normalizeFaq(faq));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.json({ message: "FAQ deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const replaceFaqCollection = async (req, res) => {
  try {
    const { countryId, isGlobal = false, faqs = [] } = req.body;

    if (!isGlobal && !countryId) {
      return res.status(400).json({ message: "countryId is required for country FAQs" });
    }

    const scopeQuery = isGlobal ? { isGlobal: true } : { isGlobal: false, countryId };

    await FAQ.deleteMany(scopeQuery);

    if (!faqs.length) {
      return res.json([]);
    }

    const payload = faqs.map((item, index) => ({
      question: item.question,
      answer: item.answer,
      tags: item.tags || [],
      isGlobal: Boolean(isGlobal),
      countryId: isGlobal ? undefined : countryId,
      order: typeof item.order === "number" ? item.order : index,
    }));

    const created = await FAQ.insertMany(payload);
    res.json(created.map(normalizeFaq));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
