import React, { createContext, useState, useContext, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [ocrData, setOcrData] = useState({});
  const [processing, setProcessing] = useState(null);

  const handleFileUpload = useCallback((documentKey, file) => {
    if (!file) return;
    setProcessing(documentKey);

    setUploadedFiles(prev => ({ ...prev, [documentKey]: { file } }));
    
    setOcrData(prev => {
      const newData = { ...prev };
      delete newData[documentKey];
      return newData;
    });

    toast({ title: "Document Uploaded", description: `AI is analyzing ${file.name}...` });

    setTimeout(() => {
      const mockOcrData = {
        bank_statement: { accountHolder: 'John Doe', balance: '₹ 5,43,210' },
        employment_letter: { company: 'Tech Corp', designation: 'Software Engineer' },
        business_reg: { companyName: 'Innovate LLC', regNumber: '987654321' },
        marriage_cert: { spouse1: 'John Doe', spouse2: 'Jane Doe' },
      };
      if (mockOcrData[documentKey]) {
        setOcrData(prev => ({ ...prev, [documentKey]: mockOcrData[documentKey] }));
        toast({ title: "AI Analysis Complete", description: "Information extracted successfully.", className: "bg-green-500 text-white" });
      }
      setProcessing(null);
    }, 2000);
  }, []);

  const handleRemoveFile = useCallback((documentKey) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[documentKey];
      return newFiles;
    });
    setOcrData(prev => {
      const newData = { ...prev };
      delete newData[documentKey];
      return newData;
    });
  }, []);

  const value = {
    uploadedFiles,
    ocrData,
    processing,
    handleFileUpload,
    handleRemoveFile,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};