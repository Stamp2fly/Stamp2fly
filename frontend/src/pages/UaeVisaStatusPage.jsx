import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const UaeVisaStatusPage = () => {
  const pageContent = {
    title: 'Check Your UAE Visa Status',
    description: 'Use the official portal below to check the status of your UAE visa application in real-time. You will need your application number and passport details.',
    embedUrl: 'https://smartservices.icp.gov.ae/echannels/web/client/default.html#/fileValidity',
  };

  return (
    <>
      <Helmet>
        <title>{pageContent.title} - Stamp2Fly</title>
        <meta name="description" content={pageContent.description} />
      </Helmet>
      <Header />
      <main>
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-3xl text-center"
            >
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                {pageContent.title}
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                {pageContent.description}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-16"
            >
              <div className="aspect-w-16 aspect-h-9 w-full h-[80vh] border-4 border-gray-200 rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  src={pageContent.embedUrl}
                  title="UAE Visa Status Checker"
                  className="w-full h-full"
                  frameBorder="0"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default UaeVisaStatusPage;