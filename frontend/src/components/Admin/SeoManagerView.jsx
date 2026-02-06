import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Megaphone, Save, Globe, FileJson, Link, Edit } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const initialPages = [
  { id: 'home', path: '/', title: 'Stamp2Fly - Simple & Fast Visa Application Services', description: 'Get your visa hassle-free with Stamp2Fly. We simplify the visa application process with clear instructions, transparent pricing, and expert support.' },
  { id: 'contact', path: '/contact', title: 'Contact Us | Stamp2Fly', description: 'Get in touch with the Stamp2Fly team for support, inquiries, or feedback.' },
  { id: 'faq', path: '/faq', title: 'Frequently Asked Questions | Stamp2Fly', description: 'Find answers to common questions about visa applications, processing times, and requirements.' },
];

const SeoManagerView = () => {
  const [pages, setPages] = useState(initialPages);
  const [selectedPageId, setSelectedPageId] = useState('home');
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'SEO Settings Saved!',
      description: `Changes for page "${selectedPage.title}" have been saved.`,
      className: 'bg-green-500 text-white',
    });
  };
  
  const handlePageDataChange = (field, value) => {
      setPages(pages.map(p => p.id === selectedPageId ? { ...p, [field]: value } : p));
  };
  
  const selectedPage = pages.find(p => p.id === selectedPageId) || pages[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">SEO Management</h1>
        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="mr-2 h-4 w-4" /> Save SEO Settings
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Edit Page Metadata</h2>
                <p className="text-gray-500 mb-6">Select a page to edit its title and meta description for search engines.</p>
                <div className="mb-6">
                    <Label htmlFor="page-select">Page</Label>
                    <Select value={selectedPageId} onValueChange={setSelectedPageId}>
                        <SelectTrigger id="page-select"><SelectValue /></SelectTrigger>
                        <SelectContent>
                        {pages.map(page => <SelectItem key={page.id} value={page.id}>{page.path}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="page-title">Meta Title</Label>
                        <Input id="page-title" value={selectedPage.title} onChange={e => handlePageDataChange('title', e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="page-description">Meta Description</Label>
                        <textarea id="page-description" rows="3" className="w-full p-2 border rounded-lg" value={selectedPage.description} onChange={e => handlePageDataChange('description', e.target.value)}></textarea>
                    </div>
                </div>
            </div>
             <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Other SEO Tools</h2>
                <p className="text-gray-500 mb-6">Manage sitemaps and other technical SEO aspects.</p>
                <div className="flex flex-wrap gap-4">
                    <Button variant="outline"><Globe className="mr-2 h-4 w-4" /> Generate Sitemap.xml</Button>
                    <Button variant="outline"><FileJson className="mr-2 h-4 w-4" /> Edit robots.txt</Button>
                    <Button variant="outline"><Link className="mr-2 h-4 w-4" /> Manage Redirects</Button>
                </div>
            </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Google Preview</h3>
                <div className="p-4 border rounded-lg bg-gray-50 space-y-2">
                    <p className="text-blue-700 text-lg truncate hover:underline cursor-pointer">{selectedPage.title}</p>
                    <p className="text-green-700 text-sm">https://www.stamp2fly.com{selectedPage.path}</p>
                    <p className="text-gray-600 text-sm">{selectedPage.description}</p>
                </div>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SeoManagerView;