import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Save, Tag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useFaq } from '@/contexts/FaqContext';
import { useVisa } from '@/contexts/VisaContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { replaceFaqCollection } from '@/api/adminApi';

const FaqManagerView = () => {
  const { faqs, setFaqs, refreshFaqs } = useFaq();
  const { visaData, refreshVisaData } = useVisa();
  const { toast } = useToast();
  const [faqType, setFaqType] = useState('general');
  const countries = useMemo(() => Object.keys(visaData), [visaData]);
  const [selectedCountry, setSelectedCountry] = useState(countries[0] || '');
  const [editableFaqs, setEditableFaqs] = useState(faqs);

  useEffect(() => {
    if (!selectedCountry && countries.length > 0) {
      setSelectedCountry(countries[0]);
    }
  }, [countries, selectedCountry]);

  useEffect(() => {
    if (faqType === 'general') {
      setEditableFaqs(faqs);
      return;
    }

    const countryFaqs = selectedCountry ? visaData[selectedCountry]?.faq || [] : [];
    setEditableFaqs(countryFaqs.map((item, index) => ({
      id: item.id || index + 1,
      q: item.q || '',
      a: item.a || '',
      tags: item.tags || [],
    })));
  }, [faqType, faqs, selectedCountry, visaData]);

  const handleAddFaq = () => {
    const newId = editableFaqs.length > 0 ? Math.max(...editableFaqs.map((f) => f.id)) + 1 : 1;
    setEditableFaqs([...editableFaqs, { id: newId, q: '', a: '', tags: [] }]);
  };

  const handleRemoveFaq = (id) => {
    setEditableFaqs(editableFaqs.filter((f) => f.id !== id));
  };

  const handleFaqChange = (id, field, value) => {
    const newFaqs = editableFaqs.map((faq) => {
      if (faq.id === id) {
        if (field === 'tags') {
          return { ...faq, [field]: value.split(',').map((t) => t.trim()) };
        }
        return { ...faq, [field]: value };
      }
      return faq;
    });
    setEditableFaqs(newFaqs);
  };

  const handleSave = async () => {
    const sanitizedFaqs = editableFaqs
      .map((faq) => ({
        ...faq,
        q: faq.q.trim(),
        a: faq.a.trim(),
        tags: (faq.tags || []).map((tag) => tag.trim()).filter(Boolean),
      }))
      .filter((faq) => faq.q && faq.a);

    if (faqType === 'general') {
      try {
        await replaceFaqCollection({
          isGlobal: true,
          faqs: sanitizedFaqs.map((faq, index) => ({
            question: faq.q,
            answer: faq.a,
            tags: faq.tags || [],
            order: index,
          })),
        });

        setFaqs(sanitizedFaqs);
        await refreshFaqs();

        toast({
          title: 'General FAQs Saved!',
          description: 'General FAQ changes are now visible on the site.',
          className: 'bg-green-500 text-white',
        });
      } catch (error) {
        toast({
          title: 'Save failed',
          description: error?.response?.data?.message || 'Could not save general FAQs.',
          variant: 'destructive',
        });
      }
      return;
    }

    if (!selectedCountry || !visaData[selectedCountry]?._id) {
      toast({ title: 'No Country Selected', description: 'Please select a country.', variant: 'destructive' });
      return;
    }

    try {
      await replaceFaqCollection({
        isGlobal: false,
        countryId: visaData[selectedCountry]._id,
        faqs: sanitizedFaqs.map((faq, index) => ({
          question: faq.q,
          answer: faq.a,
          tags: faq.tags || [],
          order: index,
        })),
      });

      await refreshVisaData();

      toast({
        title: 'Country FAQs Saved!',
        description: `FAQs for ${selectedCountry} are now visible on the site.`,
        className: 'bg-green-500 text-white',
      });
    } catch (error) {
      toast({
        title: 'Save failed',
        description: error?.response?.data?.message || 'Could not save country FAQs.',
        variant: 'destructive',
      });
    }
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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">FAQ Manager</h1>
        <Button onClick={handleSave} className="bg-slate-800 hover:bg-slate-900 text-white">
          <Save className="mr-2 h-4 w-4" /> Save FAQs
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="font-semibold text-gray-700 block mb-2">FAQ Type</label>
            <Select value={faqType} onValueChange={setFaqType}>
              <SelectTrigger>
                <SelectValue placeholder="Select FAQ type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General FAQ</SelectItem>
                <SelectItem value="country">Country-specific FAQ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {faqType === 'country' && (
            <div>
              <label className="font-semibold text-gray-700 block mb-2">Country</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {visaData[country]?.flag} {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex justify-end mb-6">
          <Button variant="outline" onClick={handleAddFaq}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add FAQ
          </Button>
        </div>
        <div className="space-y-6">
          {editableFaqs.map((faq) => (
            <motion.div key={faq.id} variants={itemVariants} className="p-6 border rounded-xl space-y-4 bg-gray-50/50 relative">
              <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => handleRemoveFaq(faq.id)}>
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>
              <div className="space-y-2">
                <label className="font-semibold text-gray-700">Question</label>
                <Input value={faq.q} onChange={e => handleFaqChange(faq.id, 'q', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="font-semibold text-gray-700">Answer</label>
                <textarea
                  value={faq.a}
                  onChange={e => handleFaqChange(faq.id, 'a', e.target.value)}
                  rows="3"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              {faqType === 'general' && (
                <div className="space-y-2">
                  <label className="font-semibold text-gray-700">Tags</label>
                  <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                          value={faq.tags.join(', ')} 
                          onChange={e => handleFaqChange(faq.id, 'tags', e.target.value)} 
                          placeholder="e.g. Documents, Fees, Processing"
                          className="pl-8"
                      />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FaqManagerView;