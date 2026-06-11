import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Plane, Briefcase, FileCheck, PhoneCall, Check } from 'lucide-react';

const services = [
  {
    name: 'Tourist Visa Application',
    description: 'Complete end-to-end assistance for your holiday and leisure travel visas. We handle the paperwork so you can focus on planning your trip.',
    icon: Plane,
  },
  {
    name: 'Business Visa Application',
    description: 'A streamlined and efficient process for your professional travel needs, including support for invitation letters and meeting schedules.',
    icon: Briefcase,
  },
  {
    name: 'Document Verification',
    description: 'Our experts meticulously review your documents to ensure they meet the consulate\'s requirements, minimizing the risk of rejection.',
    icon: FileCheck,
  },
  {
    name: 'Personalized Visa Consultation',
    description: 'Get expert advice for complex travel situations, past rejections, or any specific queries you have about your application.',
    icon: PhoneCall,
  },
];

const ServicesPage = () => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.stamp2fly.com" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://www.stamp2fly.com/services" },
    ],
  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Stamp2Fly Visa Services",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        provider: {
          "@type": "LocalBusiness",
          name: "Stamp2Fly",
          url: "https://www.stamp2fly.com",
        },
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>Visa Processing Services | Tourist &amp; Business | Stamp2Fly</title>
        <meta name="description" content="Stamp2Fly offers end-to-end visa processing services including tourist visa applications, business visas, document verification, and expert consultation." />
        <link rel="canonical" href="https://www.stamp2fly.com/services" />
        <meta property="og:title" content="Visa Processing Services | Stamp2Fly" />
        <meta property="og:description" content="Stamp2Fly offers tourist visa, business visa, document verification, and expert consultation services across India." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.stamp2fly.com/services" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Visa Processing Services | Stamp2Fly" />
        <meta name="twitter:description" content="Stamp2Fly offers tourist visa, business visa, document verification, and expert consultation services across India." />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(servicesSchema)}</script>
      </Helmet>
      <Header />
      <main>
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-2xl lg:text-center"
            >
              <p className="text-base font-semibold leading-7 text-emerald-600">What We Offer</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Expert Services for Every Traveler
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                We provide a comprehensive suite of services designed to handle every aspect of your visa application, ensuring a smooth and successful outcome.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
            >
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                {services.map((service, index) => (
                  <motion.div 
                    key={service.name} 
                    className="relative pl-16"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  >
                    <dt className="text-base font-semibold leading-7 text-gray-900">
                      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500">
                        <service.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      {service.name}
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600">{service.description}</dd>
                  </motion.div>
                ))}
              </dl>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ServicesPage;