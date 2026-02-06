import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, FileText, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const mockApplications = [
  { id: 'S2F-1002', country: 'Canada', status: 'Approved', date: '2025-06-28', icon: CheckCircle, color: 'text-emerald-500' },
  { id: 'S2F-1003', country: 'United Kingdom', status: 'Requires Action', date: '2025-07-02', icon: Clock, color: 'text-yellow-500' },
  { id: 'S2F-1004', country: 'Australia', status: 'Rejected', date: '2025-06-30', icon: XCircle, color: 'text-red-500' },
];

const UserDashboard = () => {
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
            <div className="space-y-4">
              {mockApplications.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <app.icon className={`w-8 h-8 ${app.color}`} />
                    <div>
                      <p className="font-semibold text-gray-800">{app.country} Visa</p>
                      <p className="text-sm text-gray-500">ID: {app.id} &bull; Submitted: {app.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full bg-opacity-20 ${app.color.replace('text-', 'bg-')} ${app.color}`}>
                      {app.status}
                    </span>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            {mockApplications.length === 0 && (
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
      <Footer />
    </>
  );
};

export default UserDashboard;