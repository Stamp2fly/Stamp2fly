import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileSignature, Download, Edit, Printer } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useApplication } from '@/contexts/ApplicationContext';
import { format } from 'date-fns';

const mockLetterTemplates = [
  { id: 'tourist-generic', name: 'Generic Tourist Visa Letter' },
  { id: 'business-invitation', name: 'Business Invitation Letter' },
  { id: 'schengen-standard', name: 'Standard Schengen Area Letter' },
];

const CoveringLetterView = () => {
  const { applications } = useApplication();
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!selectedApplicantId || !selectedTemplate) {
      toast({ title: "Selection Missing", description: "Please select an applicant and a template.", variant: "destructive" });
      return;
    }
    const applicant = applications.find(a => a.id === selectedApplicantId);
    const template = mockLetterTemplates.find(t => t.id === selectedTemplate);
    
    const travelDates = applicant.questionnaire?.travelDates;
    const travelDateString = travelDates?.from
      ? `from ${format(new Date(travelDates.from), 'MMMM dd, yyyy')} to ${travelDates.to ? format(new Date(travelDates.to), 'MMMM dd, yyyy') : 'N/A'}`
      : 'as per the attached itinerary';

    const letterContent = `
Date: ${new Date().toLocaleDateString()}

To,
The Visa Officer,
Consulate General of ${applicant.country || '[Country Name]'}

Subject: Application for ${applicant.questionnaire?.purposeOfVisit || 'Visa'}

Dear Sir/Madam,

I, ${applicant.applicantName}, would like to apply for a visa for my upcoming trip.
My travel dates are ${travelDateString}.

This letter is generated based on the "${template.name}" template. All my details are as per my passport, number ${applicant.passportInfo.passportNumber}.

Thank you for your consideration.

Sincerely,
${applicant.applicantName}
    `;
    setGeneratedLetter(letterContent.trim());
    toast({ title: "Letter Generated", description: `Covering letter for ${applicant.applicantName} is ready.`, className: 'bg-green-500 text-white' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8">
      <motion.h1 variants={itemVariants} className="text-3xl font-bold text-gray-800">Automated Covering Letter Generation</motion.h1>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-2xl shadow-lg">
        <div>
          <label className="font-semibold block mb-2">1. Select Applicant</label>
          <Select onValueChange={setSelectedApplicantId}>
            <SelectTrigger><SelectValue placeholder="Choose an applicant..." /></SelectTrigger>
            <SelectContent>
              {applications.map(app => <SelectItem key={app.id} value={app.id}>{app.applicantName} ({app.id})</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="font-semibold block mb-2">2. Select Letter Template</label>
          <Select onValueChange={setSelectedTemplate}>
            <SelectTrigger><SelectValue placeholder="Choose a letter template..." /></SelectTrigger>
            <SelectContent>
              {mockLetterTemplates.map(form => <SelectItem key={form.id} value={form.id}>{form.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button onClick={handleGenerate} className="w-full">
            <FileSignature className="mr-2 h-4 w-4" /> Generate Letter
          </Button>
        </div>
      </motion.div>

      {generatedLetter && (
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Generated Letter Preview</h2>
          <textarea
            value={generatedLetter}
            onChange={(e) => setGeneratedLetter(e.target.value)}
            className="w-full h-96 p-4 border rounded-lg bg-gray-50/50 font-mono text-sm"
          />
          <div className="flex flex-wrap gap-4 mt-6">
            <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700"><Download className="mr-2 h-4 w-4" /> Download DOCX</Button>
            <Button variant="secondary"><Printer className="mr-2 h-4 w-4" /> Print</Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CoveringLetterView;