import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Save, Tag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const initialFaqs = [
  { id: 1, q: 'Is travel insurance mandatory?', a: 'Yes, for most visa types, travel insurance is required.', tags: ['Documents', 'Insurance'] },
  { id: 2, q: 'Can I get a visa on arrival?', a: 'This depends on the country and your nationality. Please check specific requirements.', tags: ['Processing'] },
  { id: 3, q: 'How long does visa processing take?', a: 'Processing times vary by country and visa type. Check the specific country page for details.', tags: ['Processing', 'Timeline'] },
];

const FaqManagerView = () => {
  const [faqs, setFaqs] = useState(initialFaqs);
  const { toast } = useToast();

  const handleAddFaq = () => {
    const newId = faqs.length > 0 ? Math.max(...faqs.map(f => f.id)) + 1 : 1;
    setFaqs([...faqs, { id: newId, q: '', a: '', tags: [] }]);
  };

  const handleRemoveFaq = (id) => {
    setFaqs(faqs.filter(f => f.id !== id));
  };

  const handleFaqChange = (id, field, value) => {
    const newFaqs = faqs.map(faq => {
      if (faq.id === id) {
        if (field === 'tags') {
          return { ...faq, [field]: value.split(',').map(t => t.trim()) };
        }
        return { ...faq, [field]: value };
      }
      return faq;
    });
    setFaqs(newFaqs);
  };

  const handleSave = () => {
    toast({ title: "FAQs Saved!", description: "Your changes have been successfully saved.", className: "bg-green-500 text-white" });
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
        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="mr-2 h-4 w-4" /> Save FAQs
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-end mb-6">
          <Button variant="outline" onClick={handleAddFaq}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add FAQ
          </Button>
        </div>
        <div className="space-y-6">
          {faqs.map(faq => (
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
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FaqManagerView;