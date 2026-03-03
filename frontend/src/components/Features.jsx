import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Clock, 
  FileText, 
  Users, 
  Phone, 
  Award,
  CheckCircle,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

function Features() {
  const handleFeatureClick = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const features = [
    {
      icon: Shield,
      title: "Guaranteed Approval",
      description: "99.2% success rate with money-back guarantee",
      color: "emerald"
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Express service available in 24-48 hours",
      color: "blue"
    },
    {
      icon: FileText,
      title: "Document Assistance",
      description: "Expert help with all required paperwork",
      color: "purple"
    },
    {
      icon: Users,
      title: "Expert Consultation",
      description: "One-on-one guidance from visa specialists",
      color: "orange"
    }
  ];

  const services = [
    "Tourist Visa Processing",
    "Business Visa Applications", 
    "Student Visa Assistance",
    "Work Permit Processing",
    "Transit Visa Services",
    "Visa Extension Support"
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose Stamp2Fly?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Professional visa services with expert guidance, fast processing, and guaranteed results
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-12 md:mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className={`w-10 sm:w-12 h-10 sm:h-12 bg-${feature.color}-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4`}>
                <feature.icon className={`w-5 sm:w-6 h-5 sm:h-6 text-${feature.color}-600`} />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-xs sm:text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              Complete Visa Services
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
              From tourist visas to business permits, we handle all types of visa applications 
              with professional expertise and personalized service.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {services.map((service, index) => (
                <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700">{service}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={handleFeatureClick}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base"
            >
              View All Services
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white"
          >
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 sm:w-6 h-5 sm:h-6" />
              </div>
              <div>
                <h4 className="text-base sm:text-xl font-bold">24/7 Expert Support</h4>
                <p className="text-xs sm:text-sm text-emerald-100">Always here to help</p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-300 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Instant application status updates</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Award className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-300 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Certified visa consultants</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-300 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Secure document handling</span>
              </div>
            </div>

            <Button
              onClick={handleFeatureClick}
              variant="outline"
              className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 text-sm sm:text-base"
            >
              Contact Support
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Features;