import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Trash2, Save, DollarSign, Clock, HelpCircle, X, ListChecks, Flag, Edit, CheckSquare, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVisa } from '@/contexts/VisaContext';
import { Checkbox } from '@/components/ui/checkbox';

const PricingManagerView = () => {
  const { visaData, updateVisaData } = useVisa();
  const [localVisaData, setLocalVisaData] = useState(JSON.parse(JSON.stringify(visaData)));
  const [selectedCountry, setSelectedCountry] = useState(Object.keys(localVisaData)[0]);
  const { toast } = useToast();

  useEffect(() => {
    setLocalVisaData(JSON.parse(JSON.stringify(visaData)));
  }, [visaData]);
  
  useEffect(() => {
    if (!localVisaData[selectedCountry] && Object.keys(localVisaData).length > 0) {
      setSelectedCountry(Object.keys(localVisaData)[0]);
    }
  }, [selectedCountry, localVisaData]);

  const handleSave = () => {
    updateVisaData(localVisaData);
    toast({
      title: 'Pricing Info Saved!',
      description: `Changes for ${selectedCountry} have been successfully saved and are now live on the website.`,
      className: 'bg-green-500 text-white',
    });
  };

  const handleOptionChange = (optionId, field, value) => {
    setLocalVisaData(prev => {
        const countryOptions = prev[selectedCountry].options.map(opt => 
            opt.id === optionId ? { ...opt, [field]: value } : opt
        );
        return {
            ...prev,
            [selectedCountry]: { ...prev[selectedCountry], options: countryOptions }
        };
    });
  };

  const handleFeeChange = (optionId, feeName, value) => {
    setLocalVisaData(prev => {
        const countryOptions = prev[selectedCountry].options.map(opt => {
            if (opt.id === optionId) {
                const newFees = { ...(opt.fees || {}), [feeName]: value };
                return { ...opt, fees: newFees };
            }
            return opt;
        });
        return {
            ...prev,
            [selectedCountry]: { ...prev[selectedCountry], options: countryOptions }
        };
    });
  };
  
  const handleAddOption = () => {
    if (!selectedCountry) return;
    const newId = Date.now();
    const newOption = {
        id: newId,
        name: 'New Visa Option',
        entry: 'Single',
        validity: '30 days',
        duration: '30 days',
        processingTime: '5-7 Business Days',
        price: 0,
        combo: false
    };
    setLocalVisaData(prev => {
        const countryOptions = [...(prev[selectedCountry].options || []), newOption];
        return {
            ...prev,
            [selectedCountry]: { ...prev[selectedCountry], options: countryOptions }
        }
    });
  };

  const handleRemoveOption = (optionId) => {
    setLocalVisaData(prev => {
        const countryOptions = prev[selectedCountry].options.filter(opt => opt.id !== optionId);
        return {
            ...prev,
            [selectedCountry]: { ...prev[selectedCountry], options: countryOptions }
        };
    });
  };
  
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };
  const currentData = localVisaData[selectedCountry];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Pricing & Visa Options Manager</h1>
        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700" disabled={!selectedCountry}>
          <Save className="mr-2 h-4 w-4" /> Save & Publish Changes
        </Button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex-grow max-w-sm mb-6">
          <Label htmlFor="country-select" className="font-semibold">Select Country</Label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry} disabled={Object.keys(localVisaData).length === 0}>
            <SelectTrigger id="country-select"><SelectValue placeholder="Select a country..." /></SelectTrigger>
            <SelectContent>
              {Object.keys(localVisaData).map(country => (
                <SelectItem key={country} value={country}>{localVisaData[country].flag} {country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {currentData ? (
          <div>
            <AnimatePresence>
                {currentData.options?.map(option => (
                    <motion.div key={option.id} variants={itemVariants} layout className="p-6 border rounded-xl mb-4 bg-gray-50/50 relative">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg text-gray-700">{option.name || 'New Visa Option'}</h3>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(option.id)}><Trash2 className="h-5 w-5 text-red-500 hover:text-red-700" /></Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="col-span-1 md:col-span-2 lg:col-span-3">
                                <Label>Option Name</Label>
                                <Input value={option.name} onChange={(e) => handleOptionChange(option.id, 'name', e.target.value)} />
                            </div>
                            <div><Label>Entry</Label><Input value={option.entry} onChange={(e) => handleOptionChange(option.id, 'entry', e.target.value)} /></div>
                            <div><Label>Validity</Label><Input value={option.validity} onChange={(e) => handleOptionChange(option.id, 'validity', e.target.value)} /></div>
                            <div><Label>Duration</Label><Input value={option.duration} onChange={(e) => handleOptionChange(option.id, 'duration', e.target.value)} /></div>
                            <div><Label>Processing Time</Label><Input value={option.processingTime} onChange={(e) => handleOptionChange(option.id, 'processingTime', e.target.value)} /></div>
                            <div><Label>Price (INR)</Label><Input type="number" value={option.price} onChange={(e) => handleOptionChange(option.id, 'price', parseFloat(e.target.value))} /></div>
                            <div><Label>Original Price (Optional)</Label><Input type="number" value={option.originalPrice} onChange={(e) => handleOptionChange(option.id, 'originalPrice', parseFloat(e.target.value))} /></div>
                            <div><Label>Absconding Fee</Label><Input value={option.fees?.absconding || ''} onChange={(e) => handleFeeChange(option.id, 'absconding', e.target.value)} /></div>
                             <div className="flex items-center space-x-2 pt-6">
                                <Checkbox id={`combo-${option.id}`} checked={option.combo} onCheckedChange={(checked) => handleOptionChange(option.id, 'combo', checked)} />
                                <Label htmlFor={`combo-${option.id}`} className="font-semibold text-gray-700 flex items-center gap-2"><Sparkles className="w-4 h-4 text-yellow-500"/>Is Combo Offer?</Label>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            <Button variant="outline" onClick={handleAddOption} className="mt-4 w-full border-dashed">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Visa Option
            </Button>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">Select a country to manage its visa pricing options.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PricingManagerView;