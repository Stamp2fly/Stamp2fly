import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2, Save, ListChecks, ToggleLeft, ToggleRight, FileType } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useVisa } from '@/contexts/VisaContext';
import { APPLICANT_TYPE_OPTIONS } from '@/constants/applicantTypes.js';

const ChecklistManagerView = () => {
  const { visaData, updateVisaData } = useVisa();
  const [selectedCountry, setSelectedCountry] = useState(Object.keys(visaData)[0] || '');
  const [selectedCategory, setSelectedCategory] = useState('base');
  const [checklist, setChecklist] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const { toast } = useToast();

  const checklistCategories = [
    { value: 'base', label: 'Base Documents (for all)' },
    ...APPLICANT_TYPE_OPTIONS,
  ];

  useEffect(() => {
    if (selectedCountry && visaData[selectedCountry]) {
      setChecklist(visaData[selectedCountry].checklist?.[selectedCategory] || []);
    } else {
      setChecklist([]);
    }
  }, [selectedCountry, selectedCategory, visaData]);

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const newItem = { key: `${selectedCategory}_${Date.now()}`, name: newItemName, description: newItemDesc };
    setChecklist([...checklist, newItem]);
    setNewItemName('');
    setNewItemDesc('');
  };

  const handleRemoveItem = (key) => {
    setChecklist(checklist.filter(item => item.key !== key));
  };

  const handleItemChange = (key, field, value) => {
    setChecklist(checklist.map(item => item.key === key ? { ...item, [field]: value } : item));
  };

  const handleSave = () => {
    if (!selectedCountry) {
        toast({ title: "No Country Selected", description: "Please select a country to save the checklist.", variant: "destructive" });
        return;
    }
    const updatedVisaData = {
      ...visaData,
      [selectedCountry]: {
        ...visaData[selectedCountry],
        checklist: {
          ...visaData[selectedCountry]?.checklist,
          [selectedCategory]: checklist,
        }
      },
    };
    updateVisaData(updatedVisaData);
    toast({ title: "Checklist Saved!", description: `Checklist for ${selectedCountry} (${selectedCategory}) has been saved.`, className: "bg-green-500 text-white" });
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Checklist Manager</h1>
        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="mr-2 h-4 w-4" /> Save Checklist
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex flex-wrap gap-4 justify-between items-end mb-6">
          <div className="flex-grow max-w-xs">
            <label className="font-semibold block mb-2">Select Country</label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger><SelectValue placeholder="Select a country..." /></SelectTrigger>
              <SelectContent>
                {Object.keys(visaData).map(country => <SelectItem key={country} value={country}>{country}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-grow max-w-xs">
            <label className="font-semibold block mb-2">Document Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger><SelectValue placeholder="Select category..." /></SelectTrigger>
              <SelectContent>
                {checklistCategories.map(cat => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {checklist.map(item => (
            <motion.div key={item.key} variants={itemVariants} className="grid grid-cols-12 gap-4 items-center p-4 border rounded-lg">
              <div className="col-span-5 flex items-center"><ListChecks className="w-5 h-5 mr-3 text-gray-400" /><Input value={item.name} onChange={e => handleItemChange(item.key, 'name', e.target.value)} /></div>
              <div className="col-span-6 flex items-center"><FileType className="w-5 h-5 mr-3 text-gray-400" /><Input value={item.description} onChange={e => handleItemChange(item.key, 'description', e.target.value)} placeholder="e.g., Last 3 months" /></div>
              <div className="col-span-1 flex justify-end">
                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.key)}><Trash2 className="h-5 w-5 text-red-500" /></Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 flex gap-4 p-4 border rounded-lg bg-gray-50/50">
          <Input placeholder="New item name (e.g., Bank Statement)" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="flex-grow" />
          <Input placeholder="Description (e.g., Last 6 months)" value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} className="flex-grow" />
          <Button onClick={handleAddItem}><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChecklistManagerView;