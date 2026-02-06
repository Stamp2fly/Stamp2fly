import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Eye, MessageSquare, Send, Upload, Paperclip, PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const mockApplications = [
  { id: 'S2F-1001', name: 'John Doe', country: 'United States', status: 'In Progress', date: '2025-07-01', documents: [{name: 'Passport.pdf'}, {name: 'Visa Photo.jpg'}], messages: [], notes: '' },
  { id: 'S2F-1002', name: 'Jane Smith', country: 'Canada', status: 'Approved', date: '2025-06-28', documents: [{name: 'Passport_Jane.pdf'}], messages: [{sender: 'admin', text: 'Your visa is approved!'}], notes: 'Confirmed flight details.' },
  { id: 'S2F-1003', name: 'Peter Jones', country: 'United Kingdom', status: 'Requires Action', date: '2025-07-02', documents: [], messages: [{sender: 'admin', text: 'Please upload your bank statement.'}], notes: 'Followed up via email.' },
  { id: 'S2F-1004', name: 'Mary Johnson', country: 'Australia', status: 'Rejected', date: '2025-06-30', documents: [{name: 'Passport.pdf'}, {name: 'Photo.jpg'}, {name: 'Itinerary.pdf'}], messages: [], notes: 'Insufficient funds.' },
  { id: 'S2F-1005', name: 'David Williams', country: 'United States', status: 'In Progress', date: '2025-07-03', documents: [{name: 'Passport.pdf'}], messages: [], notes: '' },
];

const statusColors = {
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-300',
  'Approved': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'Requires Action': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Rejected': 'bg-red-100 text-red-800 border-red-300',
};

const ApplicationsView = () => {
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filters, setFilters] = useState({ status: 'all', country: 'all', search: '' });

  const handleStatusChange = (appId, newStatus) => {
    setApplications(prevApps => 
      prevApps.map(app => app.id === appId ? { ...app, status: newStatus } : app)
    );
  };

  const filteredApplications = applications.filter(app => {
    return (filters.status !== 'all' ? app.status === filters.status : true) &&
           (filters.country !== 'all' ? app.country === filters.country : true) &&
           (filters.search ? (app.name.toLowerCase().includes(filters.search.toLowerCase()) || app.id.toLowerCase().includes(filters.search.toLowerCase())) : true);
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Applications</h1>
        <Button className="bg-slate-800 hover:bg-slate-900">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Application
        </Button>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input placeholder="Search by name or ID..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} className="pl-10"/>
        </div>
        <Select value={filters.status} onValueChange={status => setFilters({...filters, status})}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by status..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.keys(statusColors).map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.country} onValueChange={country => setFilters({...filters, country})}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by country..." /></SelectTrigger>
          <SelectContent>
             <SelectItem value="all">All Countries</SelectItem>
            {[...new Set(mockApplications.map(a => a.country))].map(country => <SelectItem key={country} value={country}>{country}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="ghost" onClick={() => setFilters({ status: 'all', country: 'all', search: '' })}>Clear</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Application ID</th>
                <th scope="col" className="px-6 py-4 font-medium">Applicant</th>
                <th scope="col" className="px-6 py-4 font-medium">Country</th>
                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                <th scope="col" className="px-6 py-4 font-medium">Date Submitted</th>
                <th scope="col" className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredApplications.map(app => (
                <tr key={app.id} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{app.id}</td>
                  <td className="px-6 py-4">{app.name}</td>
                  <td className="px-6 py-4">{app.country}</td>
                  <td className="px-6 py-4">
                    <Select value={app.status} onValueChange={(newStatus) => handleStatusChange(app.id, newStatus)}>
                      <SelectTrigger className={`w-[150px] text-xs font-semibold h-8 ${statusColors[app.status]}`}>
                        <SelectValue placeholder="Set status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(statusColors).map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4">{app.date}</td>
                  <td className="px-6 py-4 text-center">
                    <Button variant="outline" size="sm" onClick={() => setSelectedApplication(app)}>Manage</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedApplication && (
        <ApplicationDetailsModal 
          application={selectedApplication} 
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </motion.div>
  );
};

const ApplicationDetailsModal = ({ application, isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [note, setNote] = useState(application.notes || '');
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!message.trim()) return;
    toast({ title: "Message Sent", description: `Message sent to ${application.name}.` });
    setMessage('');
  };

  const handleSaveNote = () => {
    toast({ title: "Note Saved", description: "Internal note has been saved." });
  };
  
  const handleRequestDocument = () => {
      toast({ title: "Feature not implemented", description: "Requesting documents is not yet available." });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-slate-800">Manage Application: {application.name} ({application.id})</DialogTitle>
        </DialogHeader>
        <div className="py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
             <h3 className="font-semibold text-slate-800">Uploaded Documents</h3>
              <div className="space-y-3">
                {application.documents.length > 0 ? (
                  application.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-slate-500" />
                        <span className="font-medium text-slate-700">{doc.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon"><Eye className="w-5 h-5 text-blue-600" /></Button>
                        <Button variant="ghost" size="icon"><Download className="w-5 h-5 text-emerald-600" /></Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 py-8">No documents uploaded.</p>
                )}
                 <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" /> Upload Document
                  </Button>
              </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <h3 className="font-semibold text-slate-800">Internal Notes</h3>
            <textarea
                rows="6"
                placeholder="Add internal notes for this application..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
            />
            <Button onClick={handleSaveNote} className="w-full bg-slate-800 hover:bg-slate-900">Save Note</Button>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <h3 className="font-semibold text-slate-800">Communication with Applicant</h3>
            <div className="bg-slate-50 p-4 rounded-lg h-48 overflow-y-auto mb-4">
              {application.messages.length > 0 ? (
                application.messages.map((msg, index) => (
                  <div key={index} className="text-sm text-slate-600 mb-2">
                    <span className="font-bold text-emerald-700 capitalize">{msg.sender}:</span> {msg.text}
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 pt-16">No messages yet.</p>
              )}
            </div>
            <div className="relative">
              <Input 
                placeholder="Type a message..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="pr-10"
              />
              <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={handleSendMessage}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="secondary" className="w-full" onClick={handleRequestDocument}>
              <Paperclip className="mr-2 h-4 w-4" /> Request a Document
            </Button>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationsView;