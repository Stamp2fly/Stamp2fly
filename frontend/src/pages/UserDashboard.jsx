import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, FileText, Clock, CheckCircle, XCircle, Eye, Send } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { getUserApplications, getApplicationById, sendApplicationMessage } from '@/api/applicationApi';

const statusConfig = {
  approved: { icon: CheckCircle, color: 'text-emerald-500', label: 'Approved' },
  rejected: { icon: XCircle, color: 'text-red-500', label: 'Rejected' },
  submitted: { icon: Clock, color: 'text-blue-500', label: 'Submitted' },
  'in-review': { icon: Clock, color: 'text-yellow-500', label: 'In Review' },
  draft: { icon: FileText, color: 'text-slate-500', label: 'Draft' },
};

const getStatusMeta = (status) => statusConfig[status] || statusConfig.draft;

const UserDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const { toast } = useToast();

  const authUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('authUser') || 'null');
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!authUser?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getUserApplications({
          userId: authUser._id,
          phone: authUser.phone,
          email: authUser.email,
        });
        setApplications(data || []);
      } catch (error) {
        toast({
          title: 'Failed to load applications',
          description: error?.response?.data?.message || 'Could not load your applications.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [authUser?._id, authUser?.phone, authUser?.email, toast]);

  const openApplication = async (appId) => {
    try {
      const full = await getApplicationById(appId);
      setSelectedApplication(full);
    } catch (error) {
      toast({
        title: 'Failed to open application',
        description: error?.response?.data?.message || 'Could not load application details.',
        variant: 'destructive',
      });
    }
  };

  const syncApplication = (updated) => {
    setSelectedApplication(updated);
    setApplications((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
  };

  return (
    <>
      <Helmet>
        <title>My Dashboard - Stamp2Fly</title>
        <meta name="description" content="Manage your visa applications and documents." />
      </Helmet>
      <Header />
      <main className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <Button asChild className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
              <Link to="/">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Application
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Applications</h2>
            {loading ? (
              <div className="space-y-3">
                <div className="h-16 rounded-xl bg-slate-100 animate-pulse" />
                <div className="h-16 rounded-xl bg-slate-100 animate-pulse" />
                <div className="h-16 rounded-xl bg-slate-100 animate-pulse" />
              </div>
            ) : (
            <div className="space-y-4">
              {applications.map((app, index) => {
                const meta = getStatusMeta(app.status);
                return (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <meta.icon className={`w-8 h-8 ${meta.color}`} />
                    <div>
                      <p className="font-semibold text-gray-800">{app.country || 'Destination'} Visa</p>
                      <p className="text-sm text-gray-500">
                        ID: {app._id?.slice(-4).toUpperCase() || 'N/A'} &bull; Submitted: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full bg-opacity-20 ${meta.color.replace('text-', 'bg-')} ${meta.color}`}>
                      {meta.label}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => openApplication(app._id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </div>
                </motion.div>
              );})}
            </div>
            )}
            {!loading && applications.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-xl">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new visa application.</p>
                <div className="mt-6">
                  <Button asChild className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
                    <Link to="/">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Start Application
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {selectedApplication && (
        <ApplicationConversationModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdated={syncApplication}
          authUser={authUser}
        />
      )}

      <Footer />
    </>
  );
};

const ApplicationConversationModal = ({ application, onClose, onUpdated, authUser }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    try {
      setIsSending(true);
      const response = await sendApplicationMessage(application._id, {
        senderRole: 'user',
        senderName: authUser?.fullName || authUser?.phone || 'User',
        text: message.trim(),
      });

      if (response?.application) {
        onUpdated(response.application);
      }

      setMessage('');
    } catch (error) {
      toast({
        title: 'Failed to send message',
        description: error?.response?.data?.message || 'Could not send message.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={!!application} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Application {application._id?.slice(-4).toUpperCase()} - {getStatusMeta(application.status).label}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
          <div className="rounded-lg border p-4 bg-slate-50">
            <h3 className="font-semibold text-slate-800 mb-3">Application Status</h3>
            <div className="space-y-2 text-sm text-slate-700">
              <div><span className="font-medium">Applicant:</span> {application.fullName || 'N/A'}</div>
              <div><span className="font-medium">Country:</span> {application.country || 'N/A'}</div>
              <div><span className="font-medium">Current Status:</span> {getStatusMeta(application.status).label}</div>
              <div><span className="font-medium">Last Updated:</span> {application.updatedAt ? new Date(application.updatedAt).toLocaleString() : 'N/A'}</div>
            </div>
          </div>

          <div className="rounded-lg border p-4 bg-white">
            <h3 className="font-semibold text-slate-800 mb-3">Communication with Admin</h3>
            <div className="h-48 overflow-y-auto border rounded-lg p-3 bg-slate-50 space-y-2">
              {application.messages?.length ? application.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`text-sm p-2 rounded ${msg.senderRole === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-white text-slate-700'}`}
                >
                  <div className="font-semibold">{msg.senderName || msg.senderRole}</div>
                  <div>{msg.text}</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-500">No messages yet.</p>
              )}
            </div>
            <div className="mt-3 relative">
              <Input
                placeholder="Type a message for admin..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="pr-10"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleSendMessage}
                disabled={isSending}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
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

export default UserDashboard;