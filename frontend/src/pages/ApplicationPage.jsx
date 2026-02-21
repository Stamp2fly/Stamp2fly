import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { format } from 'date-fns';
import {
  ArrowLeft, FileText, Loader2, Trash2, Phone, Mail, Heart, Briefcase, Users, Home, ArrowRight, PlusCircle, XCircle, Calendar as CalendarIcon, Camera, FileScan, CheckCircle, DollarSign, FileBadge, FileHeart, Upload
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/components/ui/use-toast';
import { useApplication } from '@/contexts/ApplicationContext';

const buildFinancialDocuments = (traveler) => {
  const baseKey = `traveler_${traveler.id}`;
  switch (traveler.occupation) {
    case 'employed':
      return [
        { key: `${baseKey}_salary_slip`, name: 'Salary Slips', description: 'Last 3 months', icon: <DollarSign className="w-5 h-5 text-gray-400" /> },
        { key: `${baseKey}_leave_letter`, name: 'Leave Approval Letter', description: 'From your employer', icon: <FileBadge className="w-5 h-5 text-gray-400" /> },
      ];
    case 'self-employed':
      return [
        { key: `${baseKey}_gst_proof`, name: 'GST/Business Registration', description: 'Proof of business', icon: <Briefcase className="w-5 h-5 text-gray-400" /> },
        { key: `${baseKey}_bank_statement_business`, name: 'Business Bank Statement', description: 'Last 6 months', icon: <DollarSign className="w-5 h-5 text-gray-400" /> },
      ];
    case 'freelancer':
      return [
        { key: `${baseKey}_contract`, name: 'Contract/Work Agreement', description: 'Proof of freelance work', icon: <FileText className="w-5 h-5 text-gray-400" /> },
        { key: `${baseKey}_bank_statement_personal`, name: 'Personal Bank Statement', description: 'Last 6 months', icon: <DollarSign className="w-5 h-5 text-gray-400" /> },
      ];
    case 'unemployed':
    case 'student':
    case 'retired':
      if (traveler.sponsorship === 'sponsored') {
        return [
          { key: `${baseKey}_sponsor_letter`, name: 'Sponsorship Letter', description: 'From your sponsor', icon: <FileHeart className="w-5 h-5 text-gray-400" /> },
          { key: `${baseKey}_sponsor_id`, name: "Sponsor's ID Proof", description: 'e.g., Passport', icon: <Users className="w-5 h-5 text-gray-400" /> },
          { key: `${baseKey}_sponsor_finance`, name: "Sponsor's Financials", description: 'e.g., Bank Statement', icon: <DollarSign className="w-5 h-5 text-gray-400" /> },
        ];
      }
      return [{ key: `${baseKey}_personal_finance`, name: 'Proof of Funds', description: 'e.g., Bank Statement', icon: <DollarSign className="w-5 h-5 text-gray-400" /> }];
    default:
      return [{ key: `${baseKey}_financial_doc`, name: 'Financial Document', description: 'e.g., Bank Statement', icon: <DollarSign className="w-5 h-5 text-gray-400" /> }];
  }
};

const FileUploadZone = ({ onUpload, uploadedFile, onRemove, title, description, icon }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fileObject = uploadedFile?._file;
    if (fileObject && fileObject instanceof File && fileObject.type.startsWith('image/')) {
      const url = URL.createObjectURL(fileObject);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [uploadedFile]);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      setIsProcessing(true);
      onUpload(acceptedFiles[0]);
      setTimeout(() => {
        setIsProcessing(false);
        toast({ title: `${title} Uploaded!`, description: "File is ready for processing.", className: "bg-green-500 text-white" });
      }, 1500);
    }
  }, [onUpload, title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'], 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: isProcessing,
  });
  
  const handleRemove = (e) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onRemove();
  }

  return (
    <div
      {...getRootProps()}
      className={`p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-center
      ${isDragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400'}
      ${uploadedFile ? 'border-emerald-500 bg-emerald-50/60' : 'bg-white'}
      ${isProcessing ? 'cursor-not-allowed opacity-70' : ''}`}
    >
      <input {...getInputProps()} />
        {uploadedFile ? (
            <div className="flex flex-col items-center justify-center h-full">
            <div className="w-full aspect-[16/10] rounded-lg overflow-hidden mb-2 bg-gray-200">
                {previewUrl ? (
                    <img src={previewUrl} alt={`${title} preview`} className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full"><FileText className="w-8 h-8 text-emerald-600" /></div>
                )}
            </div>
            <p className="font-semibold text-emerald-800 break-all text-xs">{uploadedFile.name}</p>
            <Button variant="destructive" size="sm" onClick={handleRemove} className="absolute top-2 right-2 h-7 w-7 p-0 z-10"><Trash2 className="w-4 h-4" /></Button>
            </div>
        ) : isProcessing ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
             <Loader2 className="w-10 h-10 text-emerald-600 mb-3 animate-spin" />
             <p className="font-semibold text-emerald-800 text-sm">Processing...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12">
            {icon}
            <p className="font-semibold text-gray-700 text-sm">{title}</p>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        )}
    </div>
  );
};

const DocumentUploadCard = ({ document, onUpload, onRemove, uploadedFile }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setIsProcessing(true);
      onUpload(document.key, acceptedFiles[0]);
      setTimeout(() => {
        setIsProcessing(false);
        toast({ title: `Uploaded ${document.name}`, className: 'bg-green-500 text-white' });
      }, 1000);
    }
  }, [document.key, document.name, onUpload]);

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
      className={`bg-white rounded-xl shadow-md border transition-all duration-300 ${uploadedFile ? 'border-emerald-500' : 'border-gray-200'}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
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
              <Button variant="ghost" size="icon" className="w-7 h-7" onClick={handleRemove}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

function ApplicationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { startApplication, updateCurrentApplication, currentApplication } = useApplication();

  const applicationState = location.state || {};
  const destination = applicationState.destination || "Visa";
  const hasPricingInfo = !!applicationState.visaDetails;

  const [travelers, setTravelers] = useState([]);
  const [travelDates, setTravelDates] = useState({ from: undefined, to: undefined });
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [activeTab, setActiveTab] = useState('traveler');

  useEffect(() => {
    if (currentApplication) {
        setTravelers(currentApplication.travelers || []);
        const savedDates = currentApplication.travelDates;
        if (savedDates && savedDates.from && savedDates.to) {
          setTravelDates({
            from: new Date(savedDates.from),
            to: new Date(savedDates.to)
          });
        } else {
          setTravelDates({ from: undefined, to: undefined });
        }
        setUploadedFiles(currentApplication.financialDocuments || {});
    } else {
        const numTravelers = parseInt(applicationState.travelers, 10) || 1;
        const initialTravelers = Array.from({ length: numTravelers }, (_, i) => ({
            id: Date.now() + i,
            passportFrontFile: null, passportBackFile: null, photoFile: null, email: '', phone: '', maritalStatus: '', occupation: '', sponsorship: 'self',
        }));
        setTravelers(initialTravelers);
        startApplication({ ...applicationState, travelers: initialTravelers, travelDates: { from: undefined, to: undefined } });
    }
  }, []);

  const handleTravelerUpdate = (id, field, value) => {
    const updatedTravelers = travelers.map((t) => (t.id === id ? { ...t, [field]: value } : t));
    setTravelers(updatedTravelers);
  };
  
  const handleFileChange = (id, field, file) => {
    const fileInfo = { name: file.name, type: file.type, size: file.size, _file: file };
    handleTravelerUpdate(id, field, fileInfo);
  };

  const addTraveler = () => {
    setTravelers([...travelers, { id: Date.now(), passportFrontFile: null, passportBackFile: null, photoFile: null, email: '', phone: '', maritalStatus: '', occupation: '', sponsorship: 'self' }]);
  };

  const removeTraveler = (id) => {
    if (travelers.length > 1) {
      setTravelers(travelers.filter(t => t.id !== id));
      setUploadedFiles(prev => {
        const next = { ...prev };
        const keyPrefix = `traveler_${id}_`;
        Object.keys(next).forEach((key) => {
          if (key.startsWith(keyPrefix)) {
            delete next[key];
          }
        });
        return next;
      });
    } else {
      toast({ title: "Cannot remove", description: "At least one traveler is required.", variant: "destructive" });
    }
  };

  const documentLists = useMemo(() => {
    return travelers.map((traveler) => ({
      travelerId: traveler.id,
      occupation: traveler.occupation,
      documents: buildFinancialDocuments(traveler),
    }));
  }, [travelers]);

  const requiredDocumentCount = useMemo(
    () => documentLists.reduce((sum, list) => sum + list.documents.length, 0),
    [documentLists]
  );

  const completedTravelerFields = useMemo(() => {
    let count = 0;
    if (travelDates.from && travelDates.to) {
      count += 1;
    }
    travelers.forEach((traveler) => {
      if (traveler.passportFrontFile) count += 1;
      if (traveler.passportBackFile) count += 1;
      if (traveler.photoFile) count += 1;
      if (traveler.email) count += 1;
      if (traveler.phone) count += 1;
      if (traveler.maritalStatus) count += 1;
      if (traveler.occupation) count += 1;
      if (traveler.sponsorship) count += 1;
    });
    return count;
  }, [travelDates, travelers]);

  const totalTravelerFields = 1 + (travelers.length * 8);

  const completedFinancialDocs = useMemo(() => {
    let count = 0;
    documentLists.forEach((list) => {
      list.documents.forEach((doc) => {
        if (uploadedFiles[doc.key]) count += 1;
      });
    });
    return count;
  }, [documentLists, uploadedFiles]);

  const totalRequired = totalTravelerFields + requiredDocumentCount;
  const completedRequired = completedTravelerFields + completedFinancialDocs;
  const progressPercent = totalRequired === 0 ? 0 : Math.round((completedRequired / totalRequired) * 100);

  const handleFinancialUpload = (key, file) => {
    const fileInfo = { name: file.name, type: file.type, size: file.size, _file: file };
    setUploadedFiles(prev => ({ ...prev, [key]: fileInfo }));
  };

  const handleFinancialRemove = (key) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[key];
      return newFiles;
    });
  };

  const validateTravelerSection = () => {
    if (!travelDates.from || !travelDates.to) {
      toast({ title: "Missing Travel Dates", description: "Please select your intended travel dates.", variant: "destructive" });
      return false;
    }

    for (const [index, traveler] of travelers.entries()) {
      if (!traveler.passportFrontFile) {
        toast({ title: "Missing Passport Front", description: `Please upload passport front page for Traveler ${index + 1}.`, variant: "destructive" });
        return false;
      }
      if (!traveler.passportBackFile) {
        toast({ title: "Missing Passport Back", description: `Please upload passport back page for Traveler ${index + 1}.`, variant: "destructive" });
        return false;
      }
      if (!traveler.photoFile) {
        toast({ title: "Missing Photo", description: `Please upload a photo for Traveler ${index + 1}.`, variant: "destructive" });
        return false;
      }
      if (!traveler.email || !traveler.phone || !traveler.maritalStatus || !traveler.occupation) {
        toast({ title: "Missing Information", description: `Please complete all fields for Traveler ${index + 1}.`, variant: "destructive" });
        return false;
      }
    }
    return true;
  };

  const validateFinancialSection = () => {
    for (const list of documentLists) {
      for (const doc of list.documents) {
        if (!uploadedFiles[doc.key]) {
          const travelerIndex = travelers.findIndex(t => t.id === list.travelerId);
          toast({ title: "Missing Documents", description: `Please upload "${doc.name}" for Traveler ${travelerIndex + 1}.`, variant: "destructive" });
          return false;
        }
      }
    }
    return true;
  };

  const handleContinueToFinancial = (e) => {
    e.preventDefault();
    if (!validateTravelerSection()) {
      return;
    }
    updateCurrentApplication({ travelers, travelDates });
    setActiveTab('financial');
  };

  const handleContinueToReview = (e) => {
    e.preventDefault();
    if (!validateTravelerSection()) {
      setActiveTab('traveler');
      return;
    }
    if (!validateFinancialSection()) {
      setActiveTab('financial');
      return;
    }
    updateCurrentApplication({ travelers, travelDates, financialDocuments: uploadedFiles });
    setActiveTab('review');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateTravelerSection()) {
      setActiveTab('traveler');
      return;
    }
    if (!validateFinancialSection()) {
      setActiveTab('financial');
      return;
    }
    updateCurrentApplication({ travelers, travelDates, financialDocuments: uploadedFiles });
    const payload = {
      ...(currentApplication || {}),
      ...applicationState,
      travelers,
      travelDates,
      financialDocuments: uploadedFiles,
    };
    navigate('/payment', { state: payload });
  };

  return (
    <>
      <Helmet>
        <title>Apply for {destination} - Stamp2Fly</title>
        <meta name="description" content="Complete your visa application by providing traveler details and uploading passports." />
      </Helmet>
      <Header />
      <main className="bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <Button onClick={() => hasPricingInfo ? navigate('/pricing', { state: applicationState }) : navigate('/')} variant="outline" className="flex items-center space-x-2 mb-8 bg-white/80 backdrop-blur-sm">
                {hasPricingInfo ? <ArrowLeft className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                <span>{hasPricingInfo ? 'Back to Pricing' : 'Back to Home'}</span>
              </Button>
              <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900">Apply for {destination} Visa</h1>
                <p className="text-lg text-gray-600 mt-2">Just a few more details to get started.</p>
              </div>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 space-y-12">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Application Completion</p>
                    <p className="text-sm font-semibold text-emerald-700">{progressPercent}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{completedRequired} of {totalRequired} required items complete</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-2 inline-flex gap-2">
                  <Button
                    type="button"
                    variant={activeTab === 'traveler' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('traveler')}
                    className={activeTab === 'traveler' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : ''}
                  >
                    Traveler Details
                  </Button>
                  <Button
                    type="button"
                    variant={activeTab === 'financial' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('financial')}
                    className={activeTab === 'financial' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : ''}
                  >
                    Financial Documents
                  </Button>
                  <Button
                    type="button"
                    variant={activeTab === 'review' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('review')}
                    className={activeTab === 'review' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : ''}
                  >
                    Review
                  </Button>
                </div>

                {activeTab === 'traveler' ? (
                  <>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><CalendarIcon className="mr-3 text-emerald-600"/>Travel Dates</h2>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button id="date" variant={"outline"} className="w-full sm:w-[320px] justify-start text-left font-normal text-gray-700">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {travelDates?.from ? (travelDates.to ? (<>{format(travelDates.from, "LLL dd, y")} - {format(travelDates.to, "LLL dd, y")}</>) : (format(travelDates.from, "LLL dd, y"))) : (<span>Pick your travel dates</span>)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar initialFocus mode="range" defaultMonth={travelDates?.from} selected={travelDates} onSelect={setTravelDates} numberOfMonths={2} />
                    </PopoverContent>
                  </Popover>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Users className="mr-3 text-emerald-600"/>Traveler Details</h2>
                   <div className="space-y-8">
                      <AnimatePresence>
                       {travelers.map((traveler, index) => (
                          <motion.div key={traveler.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-6 rounded-2xl border border-gray-200 bg-gray-50/50 relative">
                            <div className="flex justify-between items-center mb-4">
                              <Label className="font-semibold text-lg text-gray-700">Traveler {index + 1}</Label>
                              {travelers.length > 1 && <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:bg-red-100 h-8 w-8" onClick={() => removeTraveler(traveler.id)}><XCircle className="w-5 h-5" /></Button>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                <div className="space-y-4">
                                    <FileUploadZone uploadedFile={traveler.passportFrontFile} onUpload={(file) => handleFileChange(traveler.id, 'passportFrontFile', file)} onRemove={() => handleTravelerUpdate(traveler.id, 'passportFrontFile', null)} title="Passport Front Page" description="PDF, JPG, PNG" icon={<FileScan className="w-8 h-8 text-gray-400 mb-2" />} />
                                    <FileUploadZone uploadedFile={traveler.passportBackFile} onUpload={(file) => handleFileChange(traveler.id, 'passportBackFile', file)} onRemove={() => handleTravelerUpdate(traveler.id, 'passportBackFile', null)} title="Passport Back Page" description="PDF, JPG, PNG" icon={<FileScan className="w-8 h-8 text-gray-400 mb-2" />} />
                                </div>
                                <div className="space-y-4">
                                    <FileUploadZone uploadedFile={traveler.photoFile} onUpload={(file) => handleFileChange(traveler.id, 'photoFile', file)} onRemove={() => handleTravelerUpdate(traveler.id, 'photoFile', null)} title="Upload Photo" description="White background" icon={<Camera className="w-8 h-8 text-gray-400 mb-2" />} />
                                </div>
                                <div className="space-y-4 md:col-span-1">
                                    <div className="grid grid-cols-1 gap-4">
                                      <div>
                                          <Label htmlFor={`email-${traveler.id}`} className="flex items-center text-sm mb-1"><Mail className="w-4 h-4 mr-2 text-gray-400" />Email</Label>
                                          <Input id={`email-${traveler.id}`} type="email" placeholder="john.doe@example.com" value={traveler.email} onChange={(e) => handleTravelerUpdate(traveler.id, 'email', e.target.value)} required />
                                      </div>
                                      <div>
                                          <Label htmlFor={`phone-${traveler.id}`} className="flex items-center text-sm mb-1"><Phone className="w-4 h-4 mr-2 text-gray-400" />Contact</Label>
                                          <Input id={`phone-${traveler.id}`} type="tel" placeholder="+91 12345 67890" value={traveler.phone} onChange={(e) => handleTravelerUpdate(traveler.id, 'phone', e.target.value)} required />
                                      </div>
                                      <div>
                                          <Label htmlFor={`maritalStatus-${traveler.id}`} className="flex items-center text-sm mb-1"><Heart className="w-4 h-4 mr-2 text-gray-400"/>Marital Status</Label>
                                          <Select value={traveler.maritalStatus} onValueChange={(v) => handleTravelerUpdate(traveler.id, 'maritalStatus', v)} required><SelectTrigger id={`maritalStatus-${traveler.id}`}><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent><SelectItem value="single">Single</SelectItem><SelectItem value="married">Married</SelectItem><SelectItem value="divorced">Divorced</SelectItem><SelectItem value="widowed">Widowed</SelectItem></SelectContent></Select>
                                      </div>
                                      <div>
                                          <Label htmlFor={`occupation-${traveler.id}`} className="flex items-center text-sm mb-1"><Briefcase className="w-4 h-4 mr-2 text-gray-400"/>Occupation</Label>
                                          <Select value={traveler.occupation} onValueChange={(v) => handleTravelerUpdate(traveler.id, 'occupation', v)} required><SelectTrigger id={`occupation-${traveler.id}`}><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent><SelectItem value="employed">Employed</SelectItem><SelectItem value="self-employed">Self-Employed</SelectItem><SelectItem value="freelancer">Freelancer</SelectItem><SelectItem value="student">Student</SelectItem><SelectItem value="retired">Retired</SelectItem><SelectItem value="unemployed">Unemployed/Homemaker</SelectItem></SelectContent></Select>
                                      </div>
                                      <div>
                                        <Label htmlFor={`sponsorship-${traveler.id}`} className="flex items-center text-sm mb-1"><Users className="w-4 h-4 mr-2 text-gray-400"/>Trip Sponsorship</Label>
                                        <Select value={traveler.sponsorship} onValueChange={(v) => handleTravelerUpdate(traveler.id, 'sponsorship', v)} required><SelectTrigger id={`sponsorship-${traveler.id}`}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="self">Self-Sponsored</SelectItem><SelectItem value="sponsored">Sponsored by someone</SelectItem></SelectContent></Select>
                                      </div>
                                    </div>
                                </div>
                            </div>
                          </motion.div>
                       ))}
                       </AnimatePresence>
                   </div>
                   <div className="mt-6">
                      <Button type="button" variant="outline" onClick={addTraveler} className="w-full border-dashed border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700">
                        <PlusCircle className="w-4 h-4 mr-2" /> Add Another Traveler
                      </Button>
                   </div>
                </motion.div>

                <div className="pt-8 border-t border-gray-200">
                    <div className="flex justify-end">
                        <Button type="button" onClick={handleContinueToFinancial} size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center">
                            <span>Continue to Financial Documents</span>
                            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </div>
                </>
                ) : (
                  <>
                    {activeTab === 'financial' ? (
                      <>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                          <h2 className="text-2xl font-bold text-gray-800 mb-6">Financial & Occupation Documents</h2>
                          <p className="text-gray-600 mb-6">Upload the required supporting documents for each traveler.</p>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            {documentLists.map((list, index) => (
                              <div key={list.travelerId} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 space-y-3">
                                <h3 className="font-bold text-gray-900 mb-2">
                                  Documents for Traveler {index + 1} <span className="text-sm font-normal text-gray-500">({list.occupation || 'not selected'})</span>
                                </h3>
                                {list.documents.map((doc) => (
                                  <DocumentUploadCard
                                    key={doc.key}
                                    document={doc}
                                    onUpload={handleFinancialUpload}
                                    onRemove={handleFinancialRemove}
                                    uploadedFile={uploadedFiles[doc.key]}
                                  />
                                ))}
                              </div>
                            ))}
                          </div>
                        </motion.div>

                        <div className="pt-8 border-t border-gray-200 flex justify-between gap-4">
                          <Button type="button" variant="outline" onClick={() => setActiveTab('traveler')}>
                            Back to Traveler Details
                          </Button>
                          <Button type="button" onClick={handleContinueToReview} size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center">
                            <span>Continue to Review</span>
                            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Your Application</h2>
                            <p className="text-gray-600">Please verify all details before you proceed to payment.</p>
                          </div>

                          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-3">Travel Dates</h3>
                            <p className="text-sm text-gray-700">
                              {travelDates?.from && travelDates?.to
                                ? `${format(travelDates.from, "LLL dd, y")} - ${format(travelDates.to, "LLL dd, y")}`
                                : 'Not selected'}
                            </p>
                          </div>

                          <div className="space-y-6">
                            {travelers.map((traveler, index) => {
                              const travelerDocs = documentLists.find((list) => list.travelerId === traveler.id)?.documents || [];
                              return (
                                <div key={traveler.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                  <h3 className="font-semibold text-gray-900 mb-4">Traveler {index + 1}</h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <p><span className="font-medium text-gray-600">Email:</span> {traveler.email || '-'}</p>
                                    <p><span className="font-medium text-gray-600">Phone:</span> {traveler.phone || '-'}</p>
                                    <p><span className="font-medium text-gray-600">Marital Status:</span> {traveler.maritalStatus || '-'}</p>
                                    <p><span className="font-medium text-gray-600">Occupation:</span> {traveler.occupation || '-'}</p>
                                    <p><span className="font-medium text-gray-600">Sponsorship:</span> {traveler.sponsorship || '-'}</p>
                                  </div>

                                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <p><span className="font-medium text-gray-600">Passport Front:</span> {traveler.passportFrontFile?.name || 'Not uploaded'}</p>
                                    <p><span className="font-medium text-gray-600">Passport Back:</span> {traveler.passportBackFile?.name || 'Not uploaded'}</p>
                                    <p><span className="font-medium text-gray-600">Photo:</span> {traveler.photoFile?.name || 'Not uploaded'}</p>
                                  </div>

                                  <div className="mt-4">
                                    <p className="font-medium text-gray-700 mb-2">Financial Documents</p>
                                    <div className="space-y-1 text-sm">
                                      {travelerDocs.map((doc) => (
                                        <p key={doc.key}>
                                          <span className="text-gray-600">{doc.name}:</span> {uploadedFiles[doc.key]?.name || 'Not uploaded'}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>

                        <div className="pt-8 border-t border-gray-200 flex justify-between gap-4">
                          <Button type="button" variant="outline" onClick={() => setActiveTab('financial')}>
                            Back to Financial Documents
                          </Button>
                          <Button type="submit" size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center">
                            <span>Proceed to Payment</span>
                            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ApplicationPage;


// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { Button } from "@/components/ui/button";
// import { Upload } from "lucide-react";

// function DocumentUploadPage() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { visaDetails, selectedVisaOption } = location.state || {};

//   const [uploadedFiles, setUploadedFiles] = useState({});

//   if (!visaDetails || !selectedVisaOption) {
//     navigate("/");
//     return null;
//   }

//   const handleFileChange = (key, file) => {
//     setUploadedFiles((prev) => ({
//       ...prev,
//       [key]: file,
//     }));
//   };

//   const renderSection = (title, docs) => {
//     if (!docs) return null;

//     return (
//       <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">
//           {title}
//         </h3>

//         <div className="space-y-4">
//           {docs.map((doc) => (
//             <div key={doc.key} className="border rounded-xl p-4">
//               <label className="block font-medium text-gray-700 mb-2">
//                 {doc.name}
//               </label>

//               <input
//                 type="file"
//                 onChange={(e) =>
//                   handleFileChange(doc.key, e.target.files[0])
//                 }
//                 className="block w-full text-sm text-gray-600"
//               />

//               {uploadedFiles[doc.key] && (
//                 <p className="text-sm text-green-600 mt-2">
//                   Uploaded: {uploadedFiles[doc.key].name}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <Header />
//       <main className="bg-gray-50 py-12">
//         <div className="max-w-4xl mx-auto px-4">

//           <h1 className="text-3xl font-bold mb-8">
//             Upload Documents – {selectedVisaOption.name}
//           </h1>

//           {renderSection("Basic Documents", visaDetails.checklist.base)}
//           {renderSection("Employed Documents", visaDetails.checklist.employed)}
//           {renderSection("Student Documents", visaDetails.checklist.student)}
//           {renderSection("Self-Employed Documents", visaDetails.checklist["self-employed"])}

//           <div className="text-right mt-8">
//             <Button
//               onClick={() =>
//                 navigate("/payment", { state: location.state })
//               }
//               className="bg-blue-600 text-white"
//             >
//               Continue to Payment
//             </Button>
//           </div>

//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// }

// export default DocumentUploadPage;








// import React, { useState, useEffect, useCallback } from "react";
// import { Helmet } from "react-helmet-async";
// import { useLocation, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { useDropzone } from "react-dropzone";
// import { format } from "date-fns";
// import {
//   ArrowLeft,
//   ArrowRight,
//   Users,
//   Calendar as CalendarIcon,
//   FileScan,
//   Camera,
//   CheckCircle
// } from "lucide-react";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Calendar } from "@/components/ui/calendar";

// function FileUploadZone({ title, uploadedFile, onUpload }) {
//   const onDrop = useCallback(
//     (acceptedFiles) => {
//       if (acceptedFiles.length > 0) {
//         onUpload(acceptedFiles[0]);
//       }
//     },
//     [onUpload]
//   );

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     maxFiles: 1,
//   });

//   return (
//     <div
//       {...getRootProps()}
//       className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-500 transition"
//     >
//       <input {...getInputProps()} />
//       {uploadedFile ? (
//         <p className="text-sm text-emerald-600 font-medium">
//           {uploadedFile.name}
//         </p>
//       ) : (
//         <>
//           <FileScan className="w-8 h-8 mx-auto text-gray-400 mb-2" />
//           <p className="text-sm text-gray-600">{title}</p>
//         </>
//       )}
//     </div>
//   );
// }

// function ApplicationPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const applicationState = location.state || {};
//   const destination = applicationState.destination || "Visa";

//   const totalSteps = 3;
//   const [currentStep, setCurrentStep] = useState(1);
//   const progress = (currentStep / totalSteps) * 100;

//   const [travelDates, setTravelDates] = useState({ from: null, to: null });

//   const [travelers, setTravelers] = useState([
//     {
//       id: 1,
//       passportFront: null,
//       passportBack: null,
//       photo: null,
//       email: "",
//       phone: ""
//     }
//   ]);

//   const [financial, setFinancial] = useState({
//     bankStatement: null,
//     salarySlip: null
//   });

//   const handleTravelerChange = (id, field, value) => {
//     setTravelers((prev) =>
//       prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
//     );
//   };

//   const nextStep = () => {
//     if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
//   };

//   const prevStep = () => {
//     if (currentStep > 1) setCurrentStep(currentStep - 1);
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Apply for {destination} - Stamp2Fly</title>
//       </Helmet>

//       <Header />

//       <main className="bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-16">
//         <div className="max-w-5xl mx-auto px-4">

//           <h1 className="text-3xl font-bold text-center mb-6">
//             Apply for {destination} Visa
//           </h1>

//           {/* PROGRESS BAR */}
//           <div className="mb-10">
//             <div className="flex justify-between text-sm mb-2 text-gray-600">
//               <span>Step {currentStep} of {totalSteps}</span>
//               <span>{Math.round(progress)}% Completed</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div
//                 className="bg-gradient-to-r from-emerald-600 to-blue-600 h-2 rounded-full transition-all duration-500"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//           </div>

//           {/* TAB BUTTONS */}
//           <div className="flex justify-center space-x-4 mb-10">
//             {["Personal Info", "Financial Docs", "Review"].map((label, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrentStep(index + 1)}
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition ${
//                   currentStep === index + 1
//                     ? "bg-emerald-600 text-white"
//                     : "bg-white text-gray-600 border"
//                 }`}
//               >
//                 {label}
//               </button>
//             ))}
//           </div>

//           <div className="bg-white rounded-3xl shadow-xl p-10">

//             {/* STEP 1 */}
//             {currentStep === 1 && (
//               <div className="space-y-8">

//                 <div>
//                   <h2 className="text-xl font-semibold mb-4 flex items-center">
//                     <CalendarIcon className="mr-2 text-emerald-600" />
//                     Travel Dates
//                   </h2>
//                   <Calendar
//                     mode="range"
//                     selected={travelDates}
//                     onSelect={setTravelDates}
//                     numberOfMonths={2}
//                   />
//                 </div>

//                 <div>
//                   <h2 className="text-xl font-semibold mb-4 flex items-center">
//                     <Users className="mr-2 text-emerald-600" />
//                     Traveler Details
//                   </h2>

//                   {travelers.map((traveler) => (
//                     <div key={traveler.id} className="space-y-6 border p-6 rounded-xl">

//                       <div className="grid md:grid-cols-3 gap-6">
//                         <FileUploadZone
//                           title="Passport Front"
//                           uploadedFile={traveler.passportFront}
//                           onUpload={(file) =>
//                             handleTravelerChange(traveler.id, "passportFront", file)
//                           }
//                         />

//                         <FileUploadZone
//                           title="Passport Back"
//                           uploadedFile={traveler.passportBack}
//                           onUpload={(file) =>
//                             handleTravelerChange(traveler.id, "passportBack", file)
//                           }
//                         />

//                         <FileUploadZone
//                           title="Photo"
//                           uploadedFile={traveler.photo}
//                           onUpload={(file) =>
//                             handleTravelerChange(traveler.id, "photo", file)
//                           }
//                         />
//                       </div>

//                       <div className="grid md:grid-cols-2 gap-6">
//                         <div>
//                           <Label>Email</Label>
//                           <Input
//                             value={traveler.email}
//                             onChange={(e) =>
//                               handleTravelerChange(traveler.id, "email", e.target.value)
//                             }
//                           />
//                         </div>
//                         <div>
//                           <Label>Phone</Label>
//                           <Input
//                             value={traveler.phone}
//                             onChange={(e) =>
//                               handleTravelerChange(traveler.id, "phone", e.target.value)
//                             }
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//               </div>
//             )}

//             {/* STEP 2 */}
//             {currentStep === 2 && (
//               <div className="space-y-8">
//                 <h2 className="text-xl font-semibold mb-4">
//                   Financial Documents
//                 </h2>

//                 <div className="grid md:grid-cols-2 gap-6">
//                   <FileUploadZone
//                     title="Bank Statement (Last 3 months)"
//                     uploadedFile={financial.bankStatement}
//                     onUpload={(file) =>
//                       setFinancial({ ...financial, bankStatement: file })
//                     }
//                   />

//                   <FileUploadZone
//                     title="Salary Slip"
//                     uploadedFile={financial.salarySlip}
//                     onUpload={(file) =>
//                       setFinancial({ ...financial, salarySlip: file })
//                     }
//                   />
//                 </div>
//               </div>
//             )}

//             {/* STEP 3 */}
//             {currentStep === 3 && (
//               <div className="space-y-6 text-center">
//                 <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
//                 <h2 className="text-2xl font-semibold">
//                   Review Your Application
//                 </h2>
//                 <p className="text-gray-600">
//                   Please confirm your details before proceeding to payment.
//                 </p>

//                 <Button
//                   className="bg-green-600 text-white mt-4"
//                   onClick={() =>
//                     navigate("/payment", {
//                       state: { travelers, financial, travelDates }
//                     })
//                   }
//                 >
//                   Proceed to Payment
//                 </Button>
//               </div>
//             )}

//             {/* NAVIGATION BUTTONS */}
//             <div className="flex justify-between mt-10 border-t pt-6">
//               {currentStep > 1 && (
//                 <Button variant="outline" onClick={prevStep}>
//                   Back
//                 </Button>
//               )}

//               {currentStep < totalSteps && (
//                 <Button
//                   className="bg-emerald-600 text-white"
//                   onClick={nextStep}
//                 >
//                   Next
//                   <ArrowRight className="w-4 h-4 ml-2" />
//                 </Button>
//               )}
//             </div>

//           </div>
//         </div>
//       </main>

//       <Footer />
//     </>
//   );
// }

// export default ApplicationPage;
