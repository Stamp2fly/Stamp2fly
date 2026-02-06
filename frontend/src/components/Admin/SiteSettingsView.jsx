import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Save, Image as ImageIcon, Link as LinkIcon, PlusCircle, Trash2, Edit, FilePlus, GripVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const SiteSettingsView = () => {
  const { toast } = useToast();
  const [siteTitle, setSiteTitle] = useState('Stamp2Fly');
  const [logoPreview, setLogoPreview] = useState(null);
  const [pages, setPages] = useState([
    { id: 1, name: 'About Us', path: '/about-us' },
    { id: 2, name: 'Services', path: '/services' },
    { id: 3, name: 'Contact', path: '/contact' },
    { id: 4, name: 'FAQ', path: '/faq' },
  ]);
  const [isAddPageModalOpen, setIsAddPageModalOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPagePath, setNewPagePath] = useState('');

  const handleSave = () => {
    toast({
      title: 'Site Settings Saved!',
      description: 'Your website settings have been updated.',
      className: 'bg-green-500 text-white',
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      toast({ title: 'Logo ready to upload!' });
    }
  };

  const handleAddPage = () => {
    if (!newPageName.trim() || !newPagePath.trim()) {
        toast({ title: "Error", description: "Page name and path cannot be empty.", variant: "destructive" });
        return;
    }
    const newPage = {
        id: Date.now(),
        name: newPageName,
        path: newPagePath.startsWith('/') ? newPagePath : `/${newPagePath}`,
    };
    setPages([...pages, newPage]);
    toast({ title: "Page Added!", description: `The page "${newPageName}" has been added to navigation.` });
    setNewPageName('');
    setNewPagePath('');
    setIsAddPageModalOpen(false);
  };
  
  const handleRemovePage = (id) => {
    setPages(pages.filter(p => p.id !== id));
    toast({ title: "Page removed from navigation." });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Site Settings</h1>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
            <Save className="mr-2 h-4 w-4" /> Save All Settings
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
              <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Branding & Identity</h2>
                  <div className="space-y-6">
                      <div>
                          <Label htmlFor="site-title">Site Title</Label>
                          <Input id="site-title" value={siteTitle} onChange={e => setSiteTitle(e.target.value)} />
                      </div>
                      <div>
                          <Label>Logo</Label>
                          <div className="flex items-center space-x-6">
                              <div className="w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                  {logoPreview ? <img src={logoPreview} alt="Logo Preview" className="max-h-full max-w-full" /> : <ImageIcon className="w-8 h-8 text-gray-400" />}
                              </div>
                              <Button asChild variant="outline">
                                  <label htmlFor="logo-upload" className="cursor-pointer">
                                      <Edit className="mr-2 h-4 w-4" /> Change Logo
                                      <input id="logo-upload" type="file" className="sr-only" accept="image/*" onChange={handleLogoUpload} />
                                  </label>
                              </Button>
                          </div>
                      </div>
                  </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Page Management</h2>
                   <div className="space-y-4">
                       {pages.map(page => (
                           <div key={page.id} className="flex items-center space-x-4 p-3 bg-gray-50/50 rounded-lg border">
                               <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                               <Input value={page.name} className="font-semibold"/>
                               <div className="flex items-center w-full">
                                   <LinkIcon className="w-4 h-4 text-gray-400 mr-2"/>
                                  <Input value={page.path} className="text-sm text-gray-500" />
                               </div>
                               <Button variant="ghost" size="icon" onClick={() => handleRemovePage(page.id)}><Trash2 className="h-5 w-5 text-red-500" /></Button>
                           </div>
                       ))}
                   </div>
                   <Button variant="outline" onClick={() => setIsAddPageModalOpen(true)} className="w-full mt-6 border-dashed">
                       <FilePlus className="mr-2 h-4 w-4" /> Add New Page
                   </Button>
              </motion.div>
          </div>
        </div>
      </motion.div>

      <Dialog open={isAddPageModalOpen} onOpenChange={setIsAddPageModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Page</DialogTitle>
            <DialogDescription>
              Enter the details for the new page you want to create. This will add it to your site navigation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
                <Label htmlFor="new-page-name">Page Name</Label>
                <Input id="new-page-name" value={newPageName} onChange={e => setNewPageName(e.target.value)} placeholder="e.g., UAE Visa Status" />
            </div>
            <div>
                <Label htmlFor="new-page-path">Page Path (URL)</Label>
                <Input id="new-page-path" value={newPagePath} onChange={e => setNewPagePath(e.target.value)} placeholder="e.g., /uae-visa-status" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPageModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddPage}>Add Page</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SiteSettingsView;