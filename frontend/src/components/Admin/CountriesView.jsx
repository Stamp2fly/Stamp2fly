import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Trash2, Save, Flag, DollarSign, Clock } from 'lucide-react';

const initialCountries = [
  { id: 1, name: 'United Arab Emirates', price: '6800', processingTime: '3-5 Business Days', flag: '🇦🇪' },
  { id: 2, name: 'Vietnam', price: '3000', processingTime: '3 Business Days', flag: '🇻🇳' },
  { id: 3, name: 'United States', price: '3000', processingTime: 'Varies', flag: '🇺🇸' },
];

const CountriesView = () => {
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
    const newId = countries.length > 0 ? Math.max(...countries.map(c => c.id)) + 1 : 1;
    setCountries([...countries, { id: newId, name: '', price: '', processingTime: '', flag: '' }]);
  };

  const handleRemoveCountry = (id) => {
    setCountries(countries.filter((c) => c.id !== id));
  };

  const handleCountryChange = (id, field, value) => {
    const newCountries = countries.map(country => {
      if (country.id === id) {
        return { ...country, [field]: value };
      }
      return country;
    });
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
        <h1 className="text-3xl font-bold text-gray-800">Countries & Pricing</h1>
        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Manage Countries and Visa Pricing</h2>
          <Button variant="outline" onClick={handleAddCountry}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Country
          </Button>
        </div>
        <div className="space-y-6">
          {countries.map((country) => (
            <motion.div 
              key={country.id} 
              variants={itemVariants}
              layout
              className="p-6 border rounded-xl space-y-4 bg-gray-50/50"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-gray-700 flex items-center">
                  <span className="mr-3 text-2xl">{country.flag || <Flag className="text-gray-400"/>}</span>
                  {country.name || 'New Country'}
                </h3>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveCountry(country.id)}>
                  <Trash2 className="h-5 w-5 text-red-500 hover:text-red-700" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor={`name-${country.id}`}>Country Name</Label>
                  <Input id={`name-${country.id}`} value={country.name} onChange={(e) => handleCountryChange(country.id, 'name', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor={`flag-${country.id}`}>Flag Emoji</Label>
                  <Input id={`flag-${country.id}`} value={country.flag} onChange={(e) => handleCountryChange(country.id, 'flag', e.target.value)} />
                </div>
                <div className="relative">
                  <Label htmlFor={`price-${country.id}`}>Pricing (INR)</Label>
                  <DollarSign className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                  <Input id={`price-${country.id}`} value={country.price} onChange={(e) => handleCountryChange(country.id, 'price', e.target.value)} className="pl-8" />
                </div>
                <div className="relative">
                  <Label htmlFor={`processing-${country.id}`}>Processing Time</Label>
                  <Clock className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                  <Input id={`processing-${country.id}`} value={country.processingTime} onChange={(e) => handleCountryChange(country.id, 'processingTime', e.target.value)} className="pl-8" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CountriesView;