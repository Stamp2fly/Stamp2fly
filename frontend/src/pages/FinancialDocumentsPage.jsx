import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  ArrowLeft, CheckCircle, Upload, Trash2, Loader2, PhoneCall, User, Briefcase, DollarSign, FileText, FileBadge, FileHeart
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useApplication } from '@/contexts/ApplicationContext';

const DocumentUploadCard = ({ document, onUpload, onRemove, uploadedFile }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      setIsProcessing(true);
      onUpload(document.key, acceptedFiles[0]);
      setTimeout(() => {
        setIsProcessing(false);
        toast({ title: `Uploaded ${document.name}`, className: "bg-green-500 text-white" });
      }, 1000);
    }
  }, [onUpload, document.key, document.name]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.jpeg', '.png', '.jpg'] },
    maxFiles: 1,
    disabled: isProcessing,
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove(document.key);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: document.index * 0.05 }}
      className={`bg-white rounded-xl shadow-md border transition-all duration-300 ${uploadedFile ? 'border-emerald-500' : 'border-gray-200'}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${uploadedFile ? 'bg-emerald-100' : 'bg-gray-100'}`}>
              {uploadedFile ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : document.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">{document.name}</h3>
              <p className="text-xs text-gray-500">{document.description}</p>
            </div>
          </div>
          {!uploadedFile ? (
            <div {...getRootProps()} className={`border border-dashed rounded-lg p-2 text-center cursor-pointer transition-colors ${isDragActive ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-300 hover:bg-gray-50'}`}>
              <input {...getInputProps()} />
              {isProcessing ? (
                <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
              ) : (
                <Upload className="w-5 h-5 text-gray-400" />
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
               <p className="text-xs font-medium text-gray-700 max-w-[100px] truncate">{uploadedFile.name}</p>
               <Button variant="ghost" size="icon" className="w-7 h-7" onClick={handleRemove}><Trash2 className="w-4 h-4 text-red-500" /></Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

function FinancialDocumentsPage() {
  const navigate = useNavigate();
  const { currentApplication, updateCurrentApplication, submitCurrentApplication } = useApplication();
  
  const [documentLists, setDocumentLists] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({});

  useEffect(() => {
    if (!currentApplication || !currentApplication.travelers) {
      toast({ title: "Application session expired.", description: "Please start your application again.", variant: "destructive" });
      navigate('/');
      return;
    }

    const generateChecklists = () => {
      const lists = currentApplication.travelers.map(traveler => {
        let docs = [];
        const baseKey = `traveler_${traveler.id}`;

        switch (traveler.occupation) {
          case 'employed':
            docs.push({ key: `${baseKey}_salary_slip`, name: 'Salary Slips', description: 'Last 3 months', icon: <DollarSign className="w-5 h-5 text-gray-400" /> });
            docs.push({ key: `${baseKey}_leave_letter`, name: 'Leave Approval Letter', description: 'From your employer', icon: <FileBadge className="w-5 h-5 text-gray-400" /> });
            break;
          case 'self-employed':
            docs.push({ key: `${baseKey}_gst_proof`, name: 'GST/Business Registration', description: 'Proof of business', icon: <Briefcase className="w-5 h-5 text-gray-400" /> });
            docs.push({ key: `${baseKey}_bank_statement_business`, name: 'Business Bank Statement', description: 'Last 6 months', icon: <DollarSign className="w-5 h-5 text-gray-400" /> });
            break;
          case 'freelancer':
            docs.push({ key: `${baseKey}_contract`, name: 'Contract/Work Agreement', description: 'Proof of freelance work', icon: <FileText className="w-5 h-5 text-gray-400" /> });
            docs.push({ key: `${baseKey}_bank_statement_personal`, name: 'Personal Bank Statement', description: 'Last 6 months', icon: <DollarSign className="w-5 h-5 text-gray-400" /> });
            break;
          case 'unemployed':
          case 'student':
          case 'retired':
             if (traveler.sponsorship === 'sponsored') {
                docs.push({ key: `${baseKey}_sponsor_letter`, name: 'Sponsorship Letter', description: 'From your sponsor', icon: <FileHeart className="w-5 h-5 text-gray-400" /> });
                docs.push({ key: `${baseKey}_sponsor_id`, name: "Sponsor's ID Proof", description: 'e.g., Passport', icon: <User className="w-5 h-5 text-gray-400" /> });
                docs.push({ key: `${baseKey}_sponsor_finance`, name: "Sponsor's Financials", description: 'e.g., Bank Statement', icon: <DollarSign className="w-5 h-5 text-gray-400" /> });
             } else {
                docs.push({ key: `${baseKey}_personal_finance`, name: 'Proof of Funds', description: 'e.g., Bank Statement', icon: <DollarSign className="w-5 h-5 text-gray-400" /> });
             }
            break;
          default:
            docs.push({ key: `${baseKey}_financial_doc`, name: 'Financial Document', description: 'e.g., Bank Statement', icon: <DollarSign className="w-5 h-5 text-gray-400" /> });
        }
        
        return { 
          travelerId: traveler.id, 
          occupation: traveler.occupation,
          documents: docs
        };
      });
      setDocumentLists(lists);
    };

    generateChecklists();
    
    if (currentApplication.financialDocuments) {
        setUploadedFiles(currentApplication.financialDocuments);
    }

  }, [currentApplication, navigate]);

  const handleFileUpload = (key, file) => {
    const fileInfo = { name: file.name, type: file.type, size: file.size, _file: file };
    setUploadedFiles(prev => ({ ...prev, [key]: fileInfo }));
  };

  const handleRemoveFile = (key) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[key];
      return newFiles;
    });
  };

  const handleSubmit = () => {
    for (const list of documentLists) {
        for (const doc of list.documents) {
            if (!uploadedFiles[doc.key]) {
                const travelerIndex = currentApplication.travelers.findIndex(t => t.id === list.travelerId);
                toast({ title: "Missing Documents", description: `Please upload "${doc.name}" for Traveler ${travelerIndex + 1}.`, variant: "destructive" });
                return;
            }
        }
    }
    
    updateCurrentApplication({ financialDocuments: uploadedFiles });
    const finalData = submitCurrentApplication();
    
    toast({
      title: "Application Submitted! 🚀",
      description: "Our team will contact you shortly. Note: Email/SMS notifications require further setup.",
      duration: 7000,
    });
    
    navigate('/consultation', { state: finalData });
  };
  
  if (!currentApplication) return null;

  return (
    <>
      <Helmet>
        <title>Financial Documents Upload - Stamp2Fly</title>
        <meta name="description" content="Upload your financial and occupation documents." />
      </Helmet>

      <Header />
      <main className="bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 min-h-screen">
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
                <Button onClick={() => navigate('/apply')} variant="outline" className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Traveler Details</span>
                </Button>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Financial & Occupation <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">Documents</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Please upload the required financial and occupation proofs for each traveler.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {documentLists.map((list, index) => (
                    <div key={list.travelerId} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 space-y-3">
                        <h3 className="font-bold text-gray-900 mb-2 flex items-center space-x-2">
                           <User className="w-5 h-5 text-emerald-600" />
                           <span>Documents for Traveler {index + 1} <span className="text-sm font-normal text-gray-500">({list.occupation})</span></span>
                        </h3>
                        {list.documents.map((doc, docIndex) => (
                             <DocumentUploadCard
                                key={doc.key}
                                document={{ ...doc, index: docIndex }}
                                onUpload={handleFileUpload}
                                onRemove={handleRemoveFile}
                                uploadedFile={uploadedFiles[doc.key]}
                             />
                        ))}
                    </div>
                ))}
            </div>

            <div className="mt-12 flex justify-center">
                 <Button
                    onClick={handleSubmit}
                    size="lg"
                    className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 px-8 py-6"
                    >
                    <PhoneCall className="w-5 h-5" />
                    <span>Book Now & Finalize</span>
                </Button>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default FinancialDocumentsPage;