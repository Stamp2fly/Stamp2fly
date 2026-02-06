import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilePlus, Download, Edit, Printer, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

const mockApplicants = [
  { id: 'S2F-1001', name: 'John Doe', data: { name: 'John Doe', passport: 'A1234567' } },
  { id: 'S2F-1002', name: 'Jane Smith', data: { name: 'Jane Smith', passport: 'B7654321' } },
  { id: 'S2F-1005', name: 'David Williams', data: { name: 'David Williams', passport: 'C1122334' } },
];

const mockFormTemplates = [
  { id: 'SGP-14A', name: 'Singapore 14A Form' },
  { id: 'USA-DS160', name: 'USA DS-160 Form' },
  { id: 'CAN-IMM5257', name: 'Canada Visitor Visa Form (IMM 5257)' },
  { id: 'UK-VAF4A', name: 'UK Appendix 4A Form' },
];

const AutomatedFormsView = () => {
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generatedForm, setGeneratedForm] = useState(null);
  const { toast } = useToast();

  const handleGenerateForm = () => {
    if (!selectedApplicant || !selectedTemplate) {
      toast({
        title: "Selection Missing",
        description: "Please select an applicant and a form template.",
        variant: "destructive"
      });
      return;
    }
    const applicantData = mockApplicants.find(a => a.id === selectedApplicant);
    const templateData = mockFormTemplates.find(t => t.id === selectedTemplate);

    setGeneratedForm({
      applicant: applicantData,
      template: templateData,
      content: `This is a generated ${templateData.name} for ${applicantData.name} with passport ${applicantData.data.passport}. The form fields would be pre-filled here.`,
      editable: true
    });
    
    toast({
      title: "Form Generated!",
      description: `${templateData.name} for ${applicantData.name} is ready.`,
      className: 'bg-green-500 text-white'
    });
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
      <motion.h1 variants={itemVariants} className="text-3xl font-bold text-gray-800">Automated Form Filling</motion.h1>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-2xl shadow-lg">
        <div>
          <label className="font-semibold block mb-2">1. Select Applicant</label>
          <Select onValueChange={setSelectedApplicant}>
            <SelectTrigger><SelectValue placeholder="Choose an applicant..." /></SelectTrigger>
            <SelectContent>
              {mockApplicants.map(app => <SelectItem key={app.id} value={app.id}>{app.name} ({app.id})</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="font-semibold block mb-2">2. Select Form Template</label>
          <Select onValueChange={setSelectedTemplate}>
            <SelectTrigger><SelectValue placeholder="Choose a form template..." /></SelectTrigger>
            <SelectContent>
              {mockFormTemplates.map(form => <SelectItem key={form.id} value={form.id}>{form.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button onClick={handleGenerateForm} className="w-full">
            <FilePlus className="mr-2 h-4 w-4" /> Generate Form
          </Button>
        </div>
      </motion.div>

      {generatedForm && (
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Generated Form: {generatedForm.template.name}</h2>
          <div className="p-6 border rounded-lg bg-gray-50 mb-6">
            <h3 className="font-bold text-lg mb-2">Preview for {generatedForm.applicant.name}</h3>
            <textarea
              readOnly={!generatedForm.editable}
              defaultValue={generatedForm.content}
              className="w-full h-48 p-2 border rounded bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700"><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
            <Button variant="secondary"><Printer className="mr-2 h-4 w-4" /> Print</Button>
            <Button variant="secondary"><Send className="mr-2 h-4 w-4" /> Email to Applicant</Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AutomatedFormsView;