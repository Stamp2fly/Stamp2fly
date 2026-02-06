import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

function UploadTips() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
    >
      <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
        <AlertCircle className="w-5 h-5 text-blue-600" />
        <span>Upload Tips</span>
      </h3>
      
      <ul className="space-y-2 text-sm text-gray-600">
        <li className="flex items-start space-x-2">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
          <span>Ensure documents are clear and readable</span>
        </li>
        <li className="flex items-start space-x-2">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
          <span>Upload high-resolution images or PDFs</span>
        </li>
        <li className="flex items-start space-x-2">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
          <span>Maximum file size: 10MB per document</span>
        </li>
        <li className="flex items-start space-x-2">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
          <span>OCR will automatically extract passport data</span>
        </li>
      </ul>
    </motion.div>
  );
}

export default UploadTips;