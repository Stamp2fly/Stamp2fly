import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { FileJson, Save, PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const mockContent = {
  homepage: {
    hero: {
      title: 'Get your visa, hassle-free',
      subtitle: 'We’ve helped thousands of people get their visas. We can help you get yours, too.',
    },
    features: [
      { title: 'No-nonsense visa applications' },
      { title: 'Clear instructions, simple forms' },
      { title: 'Transparent pricing, no surprises' },
      { title: 'Friendly support, seven days a week' },
    ],
  },
  contact: {
    title: 'Get in Touch',
    address: '123 Visa Lane, Mumbai, India',
    email: 'contact@stamp2fly.com',
  },
  about: {
    title: 'About Stamp2Fly',
    mission: 'Our mission is to make international travel accessible to everyone by simplifying the visa application process.',
    story: 'Founded in 2020, Stamp2Fly was born out of the frustration with complicated and opaque visa procedures. We decided to build a platform that is user-friendly, transparent, and supportive.',
  },
  services: {
    title: 'Our Services',
    description: 'We offer a range of services to meet your visa needs, from standard applications to express processing and consultations.',
    list: [
      { name: 'Tourist Visa Application', description: 'Complete assistance for your holiday trips.' },
      { name: 'Business Visa Application', description: 'Streamlined process for your professional travel.' },
      { name: 'Document Verification', description: 'Ensure all your documents are correct before submission.' },
      { name: 'Visa Consultation', description: 'Expert advice for complex travel situations.' },
    ],
  },
  uaeVisaStatus: {
    title: 'Check Your UAE Visa Status',
    description: 'Use the official portal below to check the status of your UAE visa application in real-time. You will need your application number and passport details.',
    embedUrl: 'https://smartservices.icp.gov.ae/echannels/web/client/default.html#/fileValidity',
  },
};

const ContentManagerView = () => {
  const [content, setContent] = useState(mockContent);
  const [selectedPage, setSelectedPage] = useState('homepage');
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Content Saved!',
      description: `Content for the ${selectedPage} page has been updated.`,
      className: 'bg-green-500 text-white',
    });
  };
  
  const handleContentChange = (path, value) => {
    const keys = path.split('.');
    setContent(prev => {
        let newContent = JSON.parse(JSON.stringify(prev));
        let current = newContent[selectedPage];
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return newContent;
    });
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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Content Management</h1>
        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="mr-2 h-4 w-4" /> Save Content
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="max-w-xs mb-6">
            <Label htmlFor="page-select">Select Page to Edit</Label>
            <Select value={selectedPage} onValueChange={setSelectedPage}>
                <SelectTrigger id="page-select"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="homepage">Homepage</SelectItem>
                    <SelectItem value="about">About Us</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="contact">Contact Page</SelectItem>
                    <SelectItem value="uaeVisaStatus">UAE Visa Status</SelectItem>
                </SelectContent>
            </Select>
        </div>
        
        {selectedPage === 'homepage' && (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold mb-2">Hero Section</h3>
                    <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50">
                        <div><Label>Title</Label><Input value={content.homepage.hero.title} onChange={e => handleContentChange('hero.title', e.target.value)} /></div>
                        <div><Label>Subtitle</Label><Input value={content.homepage.hero.subtitle} onChange={e => handleContentChange('hero.subtitle', e.target.value)} /></div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-2">Features Section</h3>
                    <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50">
                        {content.homepage.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Input value={feature.title} onChange={e => handleContentChange(`features.${index}.title`, e.target.value)} />
                                <Button size="icon" variant="ghost"><Trash2 className="w-4 h-4 text-red-500"/></Button>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full border-dashed"><PlusCircle className="w-4 h-4 mr-2"/> Add Feature</Button>
                    </div>
                </div>
            </div>
        )}

        {selectedPage === 'about' && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50">
                <div><Label>Page Title</Label><Input value={content.about.title} onChange={e => handleContentChange('title', e.target.value)} /></div>
                <div><Label>Our Mission</Label><textarea rows="3" className="w-full p-2 border rounded-lg" value={content.about.mission} onChange={e => handleContentChange('mission', e.target.value)}></textarea></div>
                <div><Label>Our Story</Label><textarea rows="5" className="w-full p-2 border rounded-lg" value={content.about.story} onChange={e => handleContentChange('story', e.target.value)}></textarea></div>
            </div>
        )}

        {selectedPage === 'services' && (
             <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold mb-2">Services Page Header</h3>
                    <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50">
                        <div><Label>Page Title</Label><Input value={content.services.title} onChange={e => handleContentChange('title', e.target.value)} /></div>
                        <div><Label>Description</Label><textarea rows="3" className="w-full p-2 border rounded-lg" value={content.services.description} onChange={e => handleContentChange('description', e.target.value)}></textarea></div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-2">List of Services</h3>
                    <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50">
                        {content.services.list.map((service, index) => (
                            <div key={index} className="flex items-start space-x-2 p-2 border-b">
                                <div className="flex-grow space-y-2">
                                    <Input placeholder="Service Name" value={service.name} onChange={e => handleContentChange(`list.${index}.name`, e.target.value)} />
                                    <Input placeholder="Service Description" value={service.description} onChange={e => handleContentChange(`list.${index}.description`, e.target.value)} />
                                </div>
                                <Button size="icon" variant="ghost"><Trash2 className="w-4 h-4 text-red-500"/></Button>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full border-dashed"><PlusCircle className="w-4 h-4 mr-2"/> Add Service</Button>
                    </div>
                </div>
            </div>
        )}
        
        {selectedPage === 'contact' && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50">
                <div><Label>Page Title</Label><Input value={content.contact.title} onChange={e => handleContentChange('title', e.target.value)} /></div>
                 <div><Label>Address</Label><Input value={content.contact.address} onChange={e => handleContentChange('address', e.target.value)} /></div>
                 <div><Label>Email</Label><Input value={content.contact.email} onChange={e => handleContentChange('email', e.target.value)} /></div>
            </div>
        )}

        {selectedPage === 'uaeVisaStatus' && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50">
                <div><Label>Page Title</Label><Input value={content.uaeVisaStatus.title} onChange={e => handleContentChange('title', e.target.value)} /></div>
                <div><Label>Description</Label><textarea rows="3" className="w-full p-2 border rounded-lg" value={content.uaeVisaStatus.description} onChange={e => handleContentChange('description', e.target.value)}></textarea></div>
                <div><Label>Embed URL</Label><Input value={content.uaeVisaStatus.embedUrl} onChange={e => handleContentChange('embedUrl', e.target.value)} /></div>
            </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ContentManagerView;