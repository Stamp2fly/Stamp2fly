import React from 'react';

function ProcessingModal({ isProcessing }) {
  if (!isProcessing) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Document</h3>
          <p className="text-gray-600">Our OCR technology is extracting information from your document...</p>
        </div>
      </div>
    </div>
  );
}

export default ProcessingModal;