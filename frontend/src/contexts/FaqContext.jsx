import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getFaqs } from "@/api/adminApi";
import { DEFAULT_FAQS } from "@/constants/faqData.js";

const FaqContext = createContext(null);

export const FaqProvider = ({ children }) => {
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);

  const refreshFaqs = useCallback(async () => {
    try {
      const response = await getFaqs({ isGlobal: true });
      const mapped = (response || []).map((item, index) => ({
        id: item._id || index + 1,
        q: item.question,
        a: item.answer,
        tags: item.tags || ["General"],
      }));

      if (mapped.length > 0) {
        setFaqs(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch FAQs", error);
    }
  }, []);

  useEffect(() => {
    refreshFaqs();
  }, [refreshFaqs]);

  const value = useMemo(
    () => ({
      faqs,
      setFaqs,
      refreshFaqs,
    }),
    [faqs, refreshFaqs],
  );

  return <FaqContext.Provider value={value}>{children}</FaqContext.Provider>;
};

export const useFaq = () => {
  const context = useContext(FaqContext);
  if (!context) {
    throw new Error("useFaq must be used within a FaqProvider");
  }
  return context;
};
