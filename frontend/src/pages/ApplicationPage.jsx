import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { format } from 'date-fns';
import {
  ArrowLeft, Upload, FileText, Loader2, Trash2, User, Phone, Mail, Heart, Briefcase, Users, Home, ArrowRight, PlusCircle, XCircle, Calendar as CalendarIcon, Camera, FileImage, FileScan
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

function ApplicationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { startApplication, updateCurrentApplication, currentApplication } = useApplication();

  const applicationState = location.state || {};
  const destination = applicationState.destination || "Visa";
  const hasPricingInfo = !!applicationState.visaDetails;

  const [travelers, setTravelers] = useState([]);
  const [travelDates, setTravelDates] = useState({ from: undefined, to: undefined });

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
    } else {
      toast({ title: "Cannot remove", description: "At least one traveler is required.", variant: "destructive" });
    }
  };

  const handleNext = (e) => {
    e.preventDefault();

    if (!travelDates.from || !travelDates.to) {
      toast({ title: "Missing Travel Dates", description: "Please select your intended travel dates.", variant: "destructive" });
      return;
    }

    for (const [index, traveler] of travelers.entries()) {
      if (!traveler.passportFrontFile) {
        toast({ title: "Missing Passport Front", description: `Please upload passport front page for Traveler ${index + 1}.`, variant: "destructive" });
        return;
      }
      if (!traveler.passportBackFile) {
        toast({ title: "Missing Passport Back", description: `Please upload passport back page for Traveler ${index + 1}.`, variant: "destructive" });
        return;
      }
      if (!traveler.photoFile) {
        toast({ title: "Missing Photo", description: `Please upload a photo for Traveler ${index + 1}.`, variant: "destructive" });
        return;
      }
      if (!traveler.email || !traveler.phone || !traveler.maritalStatus || !traveler.occupation) {
        toast({ title: "Missing Information", description: `Please complete all fields for Traveler ${index + 1}.`, variant: "destructive" });
        return;
      }
    }

    updateCurrentApplication({ travelers, travelDates });
    navigate('/financial-documents');
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

            <form onSubmit={handleNext}>
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 space-y-12">
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
                        <Button type="submit" size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center">
                            <span>Next: Financial Documents</span>
                            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </div>
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