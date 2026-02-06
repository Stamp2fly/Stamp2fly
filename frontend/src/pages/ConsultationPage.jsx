import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, PhoneCall, User, Clock, FileText, Mail, Phone, Users, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

function ConsultationPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const applicationData = location.state || {};

    const pageTitle = `Consultation Booked - ${applicationData.destination || 'Visa'} | Stamp2Fly`;
    const pageDescription = `Your free visa consultation for ${applicationData.destination} has been booked. Our experts will call you shortly.`;
    
    if (!applicationData.id) {
        return (
            <>
            <Header/>
            <main className="flex items-center justify-center min-h-[80vh] bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">No application data found.</h1>
                    <p className="text-gray-600">Please start a new application.</p>
                    <Button asChild className="mt-4"><Link to="/">Go Home</Link></Button>
                </div>
            </main>
            <Footer/>
            </>
        )
    }

    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
            </Helmet>
            <Header />
            <main className="bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
                <section className="py-20 md:py-24">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                             className="text-center"
                        >
                            <div className="inline-block bg-white p-4 rounded-full shadow-2xl border-4 border-emerald-300">
                                <CheckCircle className="w-16 h-16 text-emerald-500" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6">Application Submitted!</h1>
                            <p className="text-lg text-gray-600 mt-3 max-w-xl mx-auto">
                                Thank you! One of our visa experts will call you shortly to guide you through the next steps for your <span className="font-semibold text-emerald-600">{applicationData.destination}</span> visa.
                            </p>
                        </motion.div>

                        <motion.div
                            className="mt-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Application Summary (ID: {applicationData.id})</h2>
                            
                            <div className="space-y-6">
                                {applicationData.travelers && applicationData.travelers.map((traveler, index) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                                        <h3 className="font-bold text-gray-800 flex items-center mb-3"><Users className="w-5 h-5 mr-2 text-blue-600" />Traveler {index + 1}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                           <p className="flex items-center"><Mail className="w-4 h-4 mr-2 text-gray-400"/> {traveler.email}</p>
                                           <p className="flex items-center"><Phone className="w-4 h-4 mr-2 text-gray-400"/> {traveler.phone}</p>
                                           <p className="flex items-center capitalize"><User className="w-4 h-4 mr-2 text-gray-400"/> Occupation: {traveler.occupation.replace('-', ' ')}</p>
                                           <p className="flex items-center capitalize"><Heart className="w-4 h-4 mr-2 text-gray-400"/> Status: {traveler.maritalStatus}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-6 pt-6 border-t">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center"><FileText className="w-5 h-5 mr-2 text-blue-600"/>Next Steps</h3>
                                <div className="grid sm:grid-cols-3 gap-4 text-center">
                                    <div className="p-4 bg-blue-50 rounded-lg"><p className="font-semibold text-blue-800 flex items-center justify-center"><PhoneCall className="w-4 h-4 mr-2"/> Expert Call</p><p className="text-xs text-blue-700">We'll contact you shortly</p></div>
                                    <div className="p-4 bg-blue-50 rounded-lg"><p className="font-semibold text-blue-800 flex items-center justify-center"><User className="w-4 h-4 mr-2"/> Verify & Pay</p><p className="text-xs text-blue-700">Confirm details & process payment</p></div>
                                    <div className="p-4 bg-blue-50 rounded-lg"><p className="font-semibold text-blue-800 flex items-center justify-center"><Clock className="w-4 h-4 mr-2"/> Fast Processing</p><p className="text-xs text-blue-700">We start your application</p></div>
                                </div>
                            </div>
                             <p className="text-center mt-6 text-sm text-gray-500">
                                You will receive an email and SMS with these details. If you don't receive them, please check your spam folder or contact us.
                            </p>
                        </motion.div>

                        <motion.div 
                            className="mt-12 text-center"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Button
                                onClick={() => navigate('/')}
                                size="lg"
                                className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-10 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Back to Home
                            </Button>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default ConsultationPage;