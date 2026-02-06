import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Trash2, Save, ListChecks, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialRequirements = {
  'United Arab Emirates': {
    checklist: ['Passport Scan', 'Photo', 'Flight Itinerary'],
    notes: 'Photo must be on a white background.'
  },
  'Vietnam': {
    checklist: ['Passport Scan', 'E-Visa Photo'],
    notes: 'Ensure passport has 6 months validity.'
  },
  'United States': {
    checklist: ['DS-160 Form Confirmation', 'Valid Passport', 'Appointment Confirmation', 'Visa Fee Receipt'],
    notes: 'Interview is mandatory for most applicants.'
  },
};

const availableCountries = [
  'United Arab Emirates',
  'Vietnam',
  'United States',
  'Canada',
  'United Kingdom',
  'Australia'
];

const RequirementsView = () => {
  const [requirements, setRequirements] = useState(initialRequirements);
  const [selectedCountry, setSelectedCountry] = useState(availableCountries[0]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Requirements Saved!',
      description: `Changes for ${selectedCountry} have been successfully saved.`,
      className: 'bg-green-500 text-white',
    });
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim() === '') return;
    const currentReqs = requirements[selectedCountry] || { checklist: [], notes: '' };
    setRequirements({
      ...requirements,
      [selectedCountry]: {
        ...currentReqs,
        checklist: [...currentReqs.checklist, newChecklistItem.trim()]
      }
    });
    setNewChecklistItem('');
  };

  const handleRemoveChecklistItem = (itemToRemove) => {
    const currentReqs = requirements[selectedCountry];
    setRequirements({
      ...requirements,
      [selectedCountry]: {
        ...currentReqs,
        checklist: currentReqs.checklist.filter(item => item !== itemToRemove)
      }
    });
  };

  const handleNotesChange = (e) => {
    const currentReqs = requirements[selectedCountry] || { checklist: [], notes: '' };
    setRequirements({
      ...requirements,
      [selectedCountry]: {
        ...currentReqs,
        notes: e.target.value
      }
    });
  };

  const currentCountryRequirements = requirements[selectedCountry] || { checklist: [], notes: '' };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Visa Requirements</h1>
        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="mb-6">
          <Label htmlFor="country-select">Select Country</Label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger id="country-select">
              <SelectValue placeholder="Select a country..." />
            </SelectTrigger>
            <SelectContent>
              {availableCountries.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center"><ListChecks className="mr-2"/> Document Checklist</h3>
            <div className="space-y-3 mb-4">
              {currentCountryRequirements.checklist.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <span className="text-gray-700">{item}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveChecklistItem(item)}>
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </motion.div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input 
                placeholder="Add new checklist item"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
              />
              <Button onClick={handleAddChecklistItem}>
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-4">Additional Notes</h3>
            <textarea
              rows="6"
              placeholder="Enter any additional notes or instructions for this country's visa application..."
              value={currentCountryRequirements.notes}
              onChange={handleNotesChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RequirementsView;