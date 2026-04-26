import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Eye,
  Send,
  Paperclip,
  PlusCircle,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { getApplications, updateApplicationStatus, getApplicationById, sendApplicationMessage } from "@/api/adminApi";

const statusColors = {
  "draft": "bg-gray-100 text-gray-800 border-gray-300",
  "submitted": "bg-blue-100 text-blue-800 border-blue-300",
  "in-review": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "approved": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "rejected": "bg-red-100 text-red-800 border-red-300",
};

const buildSubmittedDocuments = (application) => {
  const docs = [];
  const primary = application?.documents || {};
  const financial = application?.financialDetails?.documents || [];

  if (primary.passportFront) {
    docs.push({ label: "Passport Front", url: primary.passportFront });
  }
  if (primary.passportBack) {
    docs.push({ label: "Passport Back", url: primary.passportBack });
  }
  if (primary.passportPhoto) {
    docs.push({ label: "Passport Photo", url: primary.passportPhoto });
  }

  financial.forEach((url, index) => {
    if (url) {
      docs.push({ label: `Financial Document ${index + 1}`, url });
    }
  });

  return docs;
};

const ApplicationsView = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  });
  const { toast } = useToast();

  const openApplication = async (app) => {
    try {
      const details = await getApplicationById(app._id);
      setSelectedApplication(details);
    } catch (error) {
      setSelectedApplication(app);
      toast({
        title: "Could not load full application",
        description: error?.response?.data?.message || "Showing available data only.",
        variant: "destructive",
      });
    }
  };

  const syncSelectedApplication = (nextApplication) => {
    setSelectedApplication(nextApplication);
    setApplications((prev) => prev.map((item) => (item._id === nextApplication._id ? nextApplication : item)));
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await getApplications();
        setApplications(data || []);
      } catch (error) {
        toast({
          title: 'Failed to load applications',
          description: error?.response?.data?.message || 'Could not load applications.',
          variant: 'destructive',
        });
        console.error('Applications fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [toast]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app._id === appId ? { ...app, status: newStatus } : app,
        ),
      );
      toast({
        title: "Status updated",
        description: `Application status changed to ${newStatus}.`,
        className: "bg-emerald-600 text-white",
      });
    } catch (error) {
      toast({
        title: "Failed to update status",
        description: error?.response?.data?.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };

  const filteredApplications = applications.filter((app) => {
    return (
      (filters.status !== "all" ? app.status === filters.status : true) &&
      (filters.search
        ? (app.fullName || "").toLowerCase().includes(filters.search.toLowerCase()) ||
          (app._id || "").toLowerCase().includes(filters.search.toLowerCase())
        : true)
    );
  });

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-12 bg-slate-200 rounded"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Applications
          </h1>
          <p className="text-sm text-slate-900">
            Manage and track all visa applications
          </p>
        </div>

        <Button className="bg-slate-400 hover:bg-slate-500">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </div>

      <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search by name or ID..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>
        <Select
          value={filters.status}
          onValueChange={(status) => setFilters({ ...filters, status })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.keys(statusColors).map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace('-', ' ').toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          onClick={() =>
            setFilters({ status: "all", search: "" })
          }
        >
          Clear
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">
                  Application ID
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Applicant
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Country
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Date Submitted
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredApplications.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-500">
                    No applications found
                  </td>
                </tr>
              )}

              {filteredApplications.map((app) => (
                <tr
                  key={app._id}
                  className="bg-white hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {app._id?.slice(-4).toUpperCase() || "N/A"}
                  </td>
                  <td className="px-6 py-4">{app.fullName || "Unknown"}</td>
                  <td className="px-6 py-4">{app.country || "N/A"}</td>
                  <td className="px-6 py-4">
                    <Select
                      value={app.status || "draft"}
                      onValueChange={(newStatus) =>
                        handleStatusChange(app._id, newStatus)
                      }
                    >
                      <SelectTrigger
                        className={`w-[150px] h-8 text-xs font-semibold border ${statusColors[app.status] || statusColors.draft}`}
                      >
                        <SelectValue placeholder="Set status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(statusColors).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.replace('-', ' ').toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-slate-100"
                      onClick={() => openApplication(app)}
                    >
                      View
                    </Button>
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
          onApplicationUpdated={syncSelectedApplication}
        />
      )}
    </motion.div>
  );
};

const ApplicationDetailsModal = ({ application, isOpen, onClose, onApplicationUpdated }) => {
  const [message, setMessage] = useState("");
  const [note, setNote] = useState(application.notes || "");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const submittedDocuments = buildSubmittedDocuments(application);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    let authUser = null;
    try {
      authUser = JSON.parse(localStorage.getItem("authUser") || "null");
    } catch {
      authUser = null;
    }

    try {
      setIsSending(true);
      const response = await sendApplicationMessage(application._id, {
        senderRole: "admin",
        senderName: authUser?.fullName || authUser?.phone || "Admin",
        text: message.trim(),
      });

      if (response?.application) {
        onApplicationUpdated(response.application);
      }

      toast({
        title: "Message Sent",
        description: `Message sent to ${application.fullName || "applicant"}.`,
      });
      setMessage("");
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: error?.response?.data?.message || "Could not send message.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveNote = () => {
    toast({
      title: "Note Saved",
      description: "Internal note has been saved.",
    });
  };

  const handleRequestDocument = () => {
    toast({
      title: "Feature not implemented",
      description: "Requesting documents is not yet available.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-slate-800">
            Application Details: {application.fullName || "Unknown Applicant"} ({application._id?.slice(-4) || "N/A"})
          </DialogTitle>
        </DialogHeader>
        <div className="py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <h3 className="font-semibold text-slate-800">Uploaded Documents</h3>
            <div className="space-y-3">
              {submittedDocuments.length > 0 ? (
                submittedDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 border rounded-lg hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-slate-500" />
                      <span className="font-medium text-slate-700">
                        {doc.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <a href={doc.url} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="icon" title="Open document">
                          <Eye className="w-5 h-5 text-blue-600" />
                        </Button>
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-8">
                  No documents uploaded.
                </p>
              )}
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <h3 className="font-semibold text-slate-800">Submitted Details</h3>
            <div className="space-y-3 rounded-lg border bg-slate-50 p-4 text-sm text-slate-700">
              <div><span className="font-semibold">Full Name:</span> {application.fullName || "N/A"}</div>
              <div><span className="font-semibold">Phone:</span> {application.phone || "N/A"}</div>
              <div><span className="font-semibold">Email:</span> {application.email || "N/A"}</div>
              <div><span className="font-semibold">Country:</span> {application.country || "N/A"}</div>
              <div><span className="font-semibold">Status:</span> {(application.status || "draft").replace("-", " ")}</div>
              <div><span className="font-semibold">Age:</span> {application.age ?? "N/A"}</div>
              <div><span className="font-semibold">Marital Status:</span> {application.maritalStatus || "N/A"}</div>
              <div><span className="font-semibold">Occupation:</span> {application.occupation || "N/A"}</div>
              <div><span className="font-semibold">Sponsorship:</span> {application.sponsorship || "N/A"}</div>
              <div>
                <span className="font-semibold">Travel Dates:</span>{" "}
                {application.travelDates?.from ? new Date(application.travelDates.from).toLocaleDateString() : "N/A"}
                {" - "}
                {application.travelDates?.to ? new Date(application.travelDates.to).toLocaleDateString() : "N/A"}
              </div>
            </div>

            <h3 className="font-semibold text-slate-800">Internal Notes</h3>
            <textarea
              rows="4"
              placeholder="Add internal notes for this application..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-slate-400 focus:outline-none text-sm"
            />
            <Button
              onClick={handleSaveNote}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white"
            >
              Save Note
            </Button>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <h3 className="font-semibold text-slate-800">
              Communication with Applicant
            </h3>
            <div className="bg-slate-50 border p-4 rounded-lg h-48 overflow-y-auto mb-4 space-y-2">
              {application.messages && application.messages.length > 0 ? (
                application.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`text-sm mb-2 p-2 rounded ${msg.senderRole === "admin" ? "bg-blue-100 text-blue-900" : "bg-white text-slate-700"}`}
                  >
                    <span className="font-bold capitalize">
                      {msg.senderName || msg.senderRole}:
                    </span>{" "}
                    {msg.text}
                    <div className="text-[11px] text-slate-500 mt-1">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 pt-16">
                  No messages yet.
                </p>
              )}
            </div>
            <div className="relative">
              <Input
                placeholder="Type a message..."
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
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleRequestDocument}
            >
              {/* <Paperclip className="mr-2 h-4 w-4" /> Request a Document */}
            </Button>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationsView;
