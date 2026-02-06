import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Heart, Briefcase, CheckCircle, Calendar as CalendarIcon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useApplication } from '@/contexts/ApplicationContext';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { format } from 'date-fns';

const steps = [
  { id: 'dates', title: 'Travel Dates', icon: CalendarIcon },
  { id: 'personal', title: 'Personal Details', icon: Heart },
  { id: 'professional', title: 'Professional Life', icon: Briefcase },
];

const OptionCard = ({ label, value, selectedValue, onChange, icon: Icon }) => (
  <label
    className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1
      ${selectedValue === value ? 'border-emerald-500 bg-emerald-50 shadow-lg' : 'border-gray-200 bg-white hover:shadow-md'}`}
  >
    <input
      type="radio"
      name={label}
      value={value}
      checked={selectedValue === value}
      onChange={(e) => onChange(e.target.value)}
      className="sr-only"
    />
    <div className={`p-3 rounded-full mb-3 ${selectedValue === value ? 'bg-emerald-100' : 'bg-gray-100'}`}>
      <Icon className={`w-6 h-6 ${selectedValue === value ? 'text-emerald-600' : 'text-gray-500'}`} />
    </div>
    <span className={`font-semibold ${selectedValue === value ? 'text-emerald-800' : 'text-gray-700'}`}>{label}</span>
  </label>
);

function QuestionnairePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addApplication } = useApplication();
  const applicationData = location.state || {};
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    maritalStatus: '',
    employmentStatus: '',
    travelDates: { from: undefined, to: undefined },
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (range) => {
    setFormData(prev => ({ ...prev, travelDates: range }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleContinue();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/passport-upload', { state: applicationData });
    }
  };

  const handleContinue = () => {
    if (!formData.maritalStatus || !formData.employmentStatus || !formData.travelDates.from) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to continue.",
        variant: "destructive"
      });
      return;
    }

    const newApplication = { 
      ...applicationData, 
      id: `S2F-${Date.now()}`,
      applicantName: applicationData.passportInfo?.givenName || 'New Applicant',
      questionnaire: formData 
    };
    addApplication(newApplication);
    navigate('/documents', { state: newApplication });
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'dates':
        return (
          <div className="space-y-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-800 text-center">What are your intended travel dates?</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className="w-[300px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.travelDates?.from ? (
                    formData.travelDates.to ? (
                      <>
                        {format(formData.travelDates.from, "LLL dd, y")} -{" "}
                        {format(formData.travelDates.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(formData.travelDates.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={formData.travelDates?.from}
                  selected={formData.travelDates}
                  onSelect={handleDateChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      case 'personal':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">What is your marital status?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Single', 'Married', 'Divorced', 'Widowed'].map(status => (
                <OptionCard key={status} label={status} value={status.toLowerCase()} selectedValue={formData.maritalStatus} onChange={(v) => handleInputChange('maritalStatus', v)} icon={Heart} />
              ))}
            </div>
          </div>
        );
      case 'professional':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">What is your employment status?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Employed', 'Self-employed', 'Student', 'Retired', 'Unemployed'].map(status => (
                <OptionCard key={status} label={status} value={status.toLowerCase()} selectedValue={formData.employmentStatus} onChange={(v) => handleInputChange('employmentStatus', v)} icon={Briefcase} />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Visa Questionnaire - Stamp2Fly</title>
        <meta name="description" content="Complete your visa application questionnaire." />
      </Helmet>

      <Header />
      <main className="bg-gray-50">
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100"
            >
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= index ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                          {currentStep > index ? <CheckCircle /> : <step.icon />}
                        </div>
                        <p className={`mt-2 text-sm font-medium ${currentStep >= index ? 'text-emerald-600' : 'text-gray-500'}`}>{step.title}</p>
                      </div>
                      {index < steps.length - 1 && <div className={`flex-1 h-1 mx-4 rounded-full ${currentStep > index ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-[150px] flex items-center justify-center"
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>

              <div className="mt-12 flex items-center justify-between">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <span>{currentStep === steps.length - 1 ? 'Finish & See Documents' : 'Continue'}</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default QuestionnairePage;