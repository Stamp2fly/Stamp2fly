import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Trash2, Save, HelpCircle, ListChecks, Flag, DollarSign, Clock, Tag, Edit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useVisa } from '@/contexts/VisaContext';
import { useNavigate } from 'react-router-dom';

const VisaManagementView = () => {
  const { visaData, updateVisaData } = useVisa();
  const [localVisaData, setLocalVisaData] = useState(visaData);
  const [selectedCountry, setSelectedCountry] = useState(Object.keys(localVisaData)[0] || '');
  const [isAddCountryModalOpen, setIsAddCountryModalOpen] = useState(false);
  const [newCountryName, setNewCountryName] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setLocalVisaData(visaData);
    if (!selectedCountry && Object.keys(visaData).length > 0) {
      setSelectedCountry(Object.keys(visaData)[0]);
    }
  }, [visaData, selectedCountry]);

  const handleSave = () => {
    updateVisaData(localVisaData);
    toast({
      title: 'Visa Info Saved!',
      description: `Changes for ${selectedCountry} have been successfully saved.`,
      className: 'bg-green-500 text-white',
    });
  };

  const handleCountryFieldChange = (field, value) => {
    if (!selectedCountry) return;
    setLocalVisaData(prev => ({
      ...prev,
      [selectedCountry]: { ...prev[selectedCountry], [field]: value }
    }));
  };

  const handleOptionChange = (index, field, value) => {
    const options = [...(localVisaData[selectedCountry]?.options || [])];
    options[index][field] = value;
    handleCountryFieldChange('options', options);
  };

  const handleAddOption = () => {
    if (!selectedCountry) return;
    const currentOptions = localVisaData[selectedCountry]?.options || [];
    handleCountryFieldChange('options', [...currentOptions, { id: Date.now(), name: 'New Visa Type', entryType: 'Single', stay: '', validity: '', processingTime: '', price: 0, currency: 'INR' }]);
  };

  const handleRemoveOption = (index) => {
    const currentOptions = localVisaData[selectedCountry]?.options || [];
    handleCountryFieldChange('options', currentOptions.filter((_, i) => i !== index));
  };

  const handleAddCountry = () => {
    if (!newCountryName.trim()) {
      toast({ title: "Error", description: "Country name cannot be empty.", variant: "destructive" });
      return;
    }
    const updatedVisaData = {
      ...localVisaData,
      [newCountryName]: {
        options: [],
        checklist: { base: [], employed: [], 'self-employed': [], student: [], sponsored: [] },
        faq: [],
        flag: '',
        source: ''
      }
    };
    updateVisaData(updatedVisaData);
    setSelectedCountry(newCountryName);
    setNewCountryName('');
    setIsAddCountryModalOpen(false);
    toast({ title: "Country Added!", description: `${newCountryName} has been added.`, className: "bg-green-500 text-white" });
  };

  const currentData = localVisaData[selectedCountry] || { options: [], checklist: {}, faq: [], flag: '', source: '' };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Visa Management</h1>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700" disabled={!selectedCountry}>
            <Save className="mr-2 h-4 w-4" /> Save & Publish Changes
          </Button>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="flex flex-wrap gap-4 justify-between items-end mb-6">
            <div className="flex-grow max-w-sm">
              <Label htmlFor="country-select" className="font-semibold">Select Country to Manage</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry} disabled={Object.keys(localVisaData).length === 0}>
                <SelectTrigger id="country-select">
                  <SelectValue placeholder="Select a country..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(localVisaData).map(country => (
                    <SelectItem key={country} value={country}>{localVisaData[country].flag} {country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsAddCountryModalOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Country
              </Button>
              <Button variant="outline" onClick={() => navigate('/admin/checklists')} disabled={!selectedCountry}>
                <ListChecks className="mr-2 h-4 w-4" /> Manage Checklist
              </Button>
            </div>
          </div>

          {selectedCountry ? (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">General Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-gray-50/50">
                  <div>
                    <Label htmlFor="flag">Flag Emoji</Label>
                    <div className="relative">
                      <Flag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="flag" value={currentData.flag || ''} onChange={(e) => handleCountryFieldChange('flag', e.target.value)} className="pl-8" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="source">Official Source URL</Label>
                    <Input id="source" value={currentData.source || ''} onChange={(e) => handleCountryFieldChange('source', e.target.value)} placeholder="https://government-visa-website.com" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Visa Categories & Pricing</h3>
                <div className="space-y-4">
                  {currentData.options && currentData.options.map((option, index) => (
                    <div key={option.id} className="p-4 border rounded-lg space-y-4 relative bg-gray-50/50">
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleRemoveOption(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><Label>Visa Type Name</Label><Input value={option.name} onChange={(e) => handleOptionChange(index, 'name', e.target.value)} /></div>
                        <div><Label>Entry Type</Label><Input value={option.entryType} onChange={(e) => handleOptionChange(index, 'entryType', e.target.value)} placeholder="e.g., Single, Multiple" /></div>
                        <div><Label>Price (INR)</Label><Input type="number" value={option.price} onChange={(e) => handleOptionChange(index, 'price', parseFloat(e.target.value) || 0)} /></div>
                        <div><Label>Stay Duration</Label><Input value={option.stay} onChange={(e) => handleOptionChange(index, 'stay', e.target.value)} placeholder="e.g., 30 days" /></div>
                        <div><Label>Visa Validity</Label><Input value={option.validity} onChange={(e) => handleOptionChange(index, 'validity', e.target.value)} placeholder="e.g., 60 days" /></div>
                        <div><Label>Processing Time</Label><Input value={option.processingTime} onChange={(e) => handleOptionChange(index, 'processingTime', e.target.value)} placeholder="e.g., 5 Working Days" /></div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={handleAddOption} className="w-full border-dashed">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Visa Category
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No countries to display.</p>
              <p className="text-gray-400 mt-2">Click "Add Country" to get started.</p>
            </div>
          )}
        </div>
      </motion.div>

      <Dialog open={isAddCountryModalOpen} onOpenChange={setIsAddCountryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Country</DialogTitle>
            <DialogDescription>
              Enter the name of the new country you want to add for visa processing.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="new-country-name">Country Name</Label>
            <Input
              id="new-country-name"
              value={newCountryName}
              onChange={(e) => setNewCountryName(e.target.value)}
              placeholder="e.g., Japan"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCountryModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCountry}>Add Country</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VisaManagementView;