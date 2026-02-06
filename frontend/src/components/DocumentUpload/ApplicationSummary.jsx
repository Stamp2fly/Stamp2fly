import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

function ApplicationSummary({ applicationData, uploadedFiles, requiredDocuments }) {
  const totalCost = applicationData.selectedPlans?.reduce((acc, plan) => acc + plan.price, 0) || 0;
  const currency = applicationData.selectedPlans?.[0]?.currency || 'USD';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-6 border border-emerald-200"
    >
      <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
        <Shield className="w-5 h-5 text-emerald-600" />
        <span>Application Summary</span>
      </h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Destination:</span>
          <span className="font-medium">{applicationData.destination || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Services:</span>
          <span className="font-medium text-right">{applicationData.selectedPlans?.map(p => p.name).join(', ') || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Documents Uploaded:</span>
          <span className="font-medium">{Object.keys(uploadedFiles).length}/{requiredDocuments.length}</span>
        </div>
        <hr className="border-emerald-200" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total Amount:</span>
          <span className="text-emerald-600">{new Intl.NumberFormat('en-IN').format(totalCost)} {currency}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default ApplicationSummary;