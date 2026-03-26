import React, { createContext, useContext, useMemo, useState } from "react";
import { DEFAULT_FAQS } from "@/constants/faqData.js";

const FaqContext = createContext(null);

export const FaqProvider = ({ children }) => {
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);

  const value = useMemo(
    () => ({
      faqs,
      setFaqs,
    }),
    [faqs],
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
