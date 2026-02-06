import React from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Camera,
  Check,
  Eye,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function DocumentCard({ 
  document, 
  index, 
  documentKey, 
  isUploaded, 
  ocrData, 
  uploadedFiles, 
  onFileUpload, 
  onRemoveFile, 
  formatFileSize 
}) {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ${
        isUploaded ? 'border-emerald-500' : 'border-gray-200'
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isUploaded ? 'bg-emerald-100' : 'bg-gray-100'
            }`}>
              {isUploaded ? (
                <Check className="w-5 h-5 text-emerald-600" />
              ) : (
                <FileText className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{document}</h3>
              <p className="text-sm text-gray-600">
                {isUploaded ? 'Document uploaded successfully' : 'Click to upload or drag and drop'}
              </p>
            </div>
          </div>

          {isUploaded && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(uploadedFiles[documentKey].url, '_blank')}
                className="flex items-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemoveFile(documentKey)}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </Button>
            </div>
          )}
        </div>

        {!isUploaded ? (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => onFileUpload(documentKey, e.target.files[0])}
              className="hidden"
              id={`file-${index}`}
            />
            <label htmlFor={`file-${index}`} className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-lg font-medium text-gray-900 mb-2">
                Click to upload or drag and drop
              </div>
              <div className="text-sm text-gray-600">
                PDF, JPG, PNG up to 10MB
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">{uploadedFiles[documentKey].name}</div>
                  <div className="text-sm text-gray-600">
                    {formatFileSize(uploadedFiles[documentKey].size)} • 
                    Uploaded {uploadedFiles[documentKey].uploadedAt.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>

            {ocrData && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Camera className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-emerald-900">OCR Results</span>
                  <span className="text-sm text-emerald-700">({ocrData.confidence}% confidence)</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-emerald-700 font-medium">Passport Number:</span>
                    <div className="text-emerald-900">{ocrData.passportNumber}</div>
                  </div>
                  <div>
                    <span className="text-emerald-700 font-medium">Full Name:</span>
                    <div className="text-emerald-900">{ocrData.fullName}</div>
                  </div>
                  <div>
                    <span className="text-emerald-700 font-medium">Nationality:</span>
                    <div className="text-emerald-900">{ocrData.nationality}</div>
                  </div>
                  <div>
                    <span className="text-emerald-700 font-medium">Expiry Date:</span>
                    <div className="text-emerald-900">{ocrData.expiryDate}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default DocumentCard;