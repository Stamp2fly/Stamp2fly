import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Download, Database, FileJson } from 'lucide-react';
import { useVisa } from '@/contexts/VisaContext';

const DataMigrationView = () => {
  const { visaData } = useVisa();
  const { toast } = useToast();

  const handleExport = () => {
    try {
      const jsonData = JSON.stringify(visaData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `stamp2fly_visa_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful!",
        description: "Your visa data has been downloaded as a JSON file.",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "Could not export your data. Please check the console for errors.",
        variant: "destructive",
      });
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-800">Data & Migration</h1>
        <p className="text-lg text-gray-600 mt-1">Export your website data for backups or migration.</p>
      </motion.div>

      <motion.div 
        variants={itemVariants} 
        transition={{ delay: 0.2 }}
        className="bg-white p-8 rounded-2xl shadow-lg"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <FileJson className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Export All Visa Data</h2>
              <p className="text-gray-600 max-w-lg mt-1">
                Download a complete JSON file of all countries, visa options, checklists, and FAQs. This is useful for creating backups or migrating your data to another platform like WordPress or a custom CMS.
              </p>
            </div>
          </div>
          <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" /> Download JSON File
          </Button>
        </div>
      </motion.div>

      <motion.div 
        variants={itemVariants} 
        transition={{ delay: 0.3 }}
        className="bg-gray-800 text-white p-8 rounded-2xl shadow-lg"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-200 p-4 rounded-full">
              <Database className="w-8 h-8 text-emerald-800" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Connect to a Database (Coming Soon)</h2>
              <p className="text-gray-300 max-w-lg mt-1">
                Soon you'll be able to sync your data with a Supabase project for real-time, persistent storage. This will enable more advanced features and scalability.
              </p>
            </div>
          </div>
          <Button disabled variant="secondary" className="w-full sm:w-auto">
            Connect Supabase
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DataMigrationView;