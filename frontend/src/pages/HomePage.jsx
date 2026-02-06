import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import VisaSearch from '@/components/VisaSearch';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

function HomePage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Stamp2Fly Professional Services",
    "url": "https://www.stamp2fly.com",
    "logo": "https://storage.googleapis.com/hostinger-horizons-assets-prod/ac7c5e33-833b-415b-87a1-38b5119ebfe9/1e7b9ac90d11a07facf22532137e65d6.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-900-438-7497",
      "contactType": "Customer Service"
    }
  };

  const features = [
    "No-nonsense visa applications",
    "Clear instructions, simple forms",
    "Transparent pricing, no surprises",
    "Friendly support, seven days a week"
  ];

  return (
    <>
      <Helmet>
        <title>Stamp2Fly - Simple & Fast Visa Application Services</title>
        <meta name="description" content="Get your visa hassle-free with Stamp2Fly. We simplify the visa application process with clear instructions, transparent pricing, and expert support." />
        <meta name="keywords" content="visa services, visa application, e-visa, fast visa, simple visa, visa online" />
        <link rel="canonical" href="https://www.stamp2fly.com/" />
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>

      <Header />
      <main className="bg-gray-50">
        <section className="text-center py-20 lg:py-32">
          <div className="max-w-4xl mx-auto px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tighter"
            >
              Get your visa, hassle-free
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
            >
              We’ve helped thousands of people get their visas. We can help you get yours, too.
            </motion.p>
          </div>
        </section>

        <section className="pb-20 lg:pb-32 -mt-16 lg:-mt-24">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <VisaSearch />
            </motion.div>
        </section>

        <section className="pb-20 lg:pb-32">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">The world's best visa experience</h2>
            <p className="mt-4 text-lg text-gray-600">Here's what makes Stamp2Fly the easiest way to get your visa:</p>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">{feature}</p>
                    <p className="text-gray-600">We make the complex simple, so you can focus on your trip.</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default HomePage;