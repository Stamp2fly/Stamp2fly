export const DEFAULT_FAQS = [
  {
    id: 1,
    q: "How long does the visa process take?",
    a: "Processing times vary by country and visa type, but typically range from 3-15 business days. We also offer express services for faster processing.",
    tags: ["General"],
  },
  {
    id: 2,
    q: "What if my visa application is rejected?",
    a: "While we have a high success rate, if a rejection occurs, we offer a money-back guarantee on our service fees and will assist you in understanding the reasons and reapplying if possible.",
    tags: ["General"],
  },
  {
    id: 3,
    q: "What documents are required?",
    a: "Required documents depend on the destination country and visa type. After you select a country, we provide a personalized checklist. Common documents include passport, photos, and application forms.",
    tags: ["Documents"],
  },
  {
    id: 4,
    q: "How do I submit my documents?",
    a: "You can securely upload all required documents through our online portal after starting your application.",
    tags: ["Documents"],
  },
  {
    id: 5,
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, debit cards, and online payment wallets.",
    tags: ["Payment"],
  },
  {
    id: 6,
    q: "Are there any hidden fees?",
    a: "No, our pricing is transparent. The total cost, including consular fees and our service charges, is clearly outlined before you make a payment.",
    tags: ["Payment"],
  },
];

export const groupFaqsByPrimaryTag = (faqs = []) => {
  const grouped = {};

  faqs.forEach((item) => {
    const tag = item?.tags?.find(Boolean)?.trim() || "General";
    if (!grouped[tag]) {
      grouped[tag] = [];
    }
    grouped[tag].push({ q: item.q, a: item.a });
  });

  return grouped;
};
