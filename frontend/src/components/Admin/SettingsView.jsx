import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Trash2, Save, Flag } from 'lucide-react';

const initialCountries = [
  { name: 'United Arab Emirates', price: '6800', checklist: ['Passport Scan', 'Photo'], processingTime: '3-5 Business Days', flag: '🇦🇪' },
  { name: 'Vietnam', price: '3000', checklist: ['Passport Scan', 'E-Visa Photo'], processingTime: '3 Business Days', flag: '🇻🇳' },
  { name: 'United States', price: '3000', checklist: ['DS-160 Form', 'Passport', 'Photo'], processingTime: 'Varies', flag: '🇺🇸' },
];

const SettingsView = () => {
  const [countries, setCountries] = useState(initialCountries);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Settings Saved!',
      description: 'Your changes have been successfully saved.',
      className: 'bg-green-500 text-white',
    });
  };

  const handleAddCountry = () => {
    setCountries([...countries, { name: '', price: '', checklist: [], processingTime: '', flag: '' }]);
  };

  const handleRemoveCountry = (index) => {
    const newCountries = countries.filter((_, i) => i !== index);
    setCountries(newCountries);
  };

  const handleCountryChange = (index, field, value) => {
    const newCountries = [...countries];
    if (field === 'checklist') {
      newCountries[index][field] = value.split(',').map(item => item.trim());
    } else {
      newCountries[index][field] = value;
    }
    setCountries(newCountries);
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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Country Management</h1>
        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Manage Countries, Pricing, and Checklists</h2>
          <Button variant="outline" onClick={handleAddCountry}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Country
          </Button>
        </div>
        <div className="space-y-6">
          {countries.map((country, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="p-6 border rounded-lg space-y-4 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-700 flex items-center">
                  <span className="mr-3 text-2xl">{country.flag || <Flag className="text-gray-400"/>}</span>
                  {country.name || 'New Country'}
                </h3>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveCountry(index)}>
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor={`name-${index}`}>Country Name</Label>
                  <Input id={`name-${index}`} value={country.name} onChange={(e) => handleCountryChange(index, 'name', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor={`flag-${index}`}>Flag Emoji</Label>
                  <Input id={`flag-${index}`} value={country.flag} onChange={(e) => handleCountryChange(index, 'flag', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor={`price-${index}`}>Pricing (INR)</Label>
                  <Input id={`price-${index}`} value={country.price} onChange={(e) => handleCountryChange(index, 'price', e.target.value)} />
                </div>
                <div className="lg:col-span-2">
                  <Label htmlFor={`checklist-${index}`}>Document Checklist (comma-separated)</Label>
                  <Input id={`checklist-${index}`} value={country.checklist.join(', ')} onChange={(e) => handleCountryChange(index, 'checklist', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor={`processing-${index}`}>Processing Time</Label>
                  <Input id={`processing-${index}`} value={country.processingTime} onChange={(e) => handleCountryChange(index, 'processingTime', e.target.value)} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsView;