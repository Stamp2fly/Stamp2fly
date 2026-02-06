import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, HelpCircle, FileText, XCircle, ExternalLink, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useVisa } from '@/contexts/VisaContext';
import { Button } from '@/components/ui/button';

function VisaRequirementPage() {
  const { destination: destSlug } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  const { visaData } = useVisa();

  const [countryData, setCountryData] = useState(null);
  const [nationality, setNationality] = useState('India');
  const [destinationName, setDestinationName] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    setNationality(queryParams.get('nationality') || 'India');

    const foundEntry = Object.entries(visaData).find(
      ([name]) => name.toLowerCase().replace(/\s+/g, '-') === destSlug
    );
    
    if (foundEntry) {
      setDestinationName(foundEntry[0]);
      setCountryData(foundEntry[1]);
    } else {
      setCountryData(null);
    }
  }, [destSlug, search, visaData]);

  const handleApply = () => {
    navigate('/pricing', { state: { destination: destinationName, nationality: nationality } });
  };
  
  if (!countryData) {
    return (
      <>
        <Header />
        <main className="min-h-[80vh] bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">Visa Information Not Found</h1>
            <p className="text-lg text-gray-600 mt-2">We couldn't find visa details for this destination.</p>
            <Button asChild className="mt-6">
              <Link to="/">Go Back Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const pageTitle = `${destinationName} Visa Requirements | Stamp2Fly`;
  const pageDescription = `Find the latest visa requirements, document checklist, processing time, and fees for ${destinationName}. Apply online with Stamp2Fly.`;
  
  const getDocumentList = () => {
    const checklist = countryData.checklist;
    if (!checklist) return [];
    let docs = [];
    if (checklist.base) docs = docs.concat(checklist.base);
    // In a real app, you'd add logic for other categories like 'employed'
    return docs;
  };

  const documentList = getDocumentList();

  const faqSchema = countryData.faq && countryData.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": countryData.faq.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  } : null;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`https://www.stamp2fly.com/visa-requirements/${destSlug}${search}`} />
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>
      
      <Header />
      
      <main className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter">
                {countryData.flag} {destinationName} Visa
              </h1>
              <p className="mt-3 text-lg text-gray-600">
                Requirements for citizens of {nationality}.
              </p>
              {countryData.source && (
                <a href={countryData.source} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                  Official Government Source <ExternalLink className="ml-1 w-4 h-4" />
                </a>
              )}
            </div>

             <div className="bg-blue-600 text-white rounded-2xl shadow-lg p-8 mb-8 text-center">
                <h3 className="text-2xl font-bold">Ready to apply?</h3>
                <p className="mt-2 opacity-90">Our experts will guide you through every step.</p>
                <Button onClick={handleApply} variant="secondary" className="mt-6 bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto px-10 group">
                    See Options & Apply <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-md border border-gray-200/80 p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-blue-600" />
                  Document Checklist
                </h3>
                <ul className="space-y-4">
                  {documentList.map(item => (
                    <li key={item.key} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-800">{item.name}</span>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-8">
                {countryData.faq && countryData.faq.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-md border border-gray-200/80 p-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <HelpCircle className="w-6 h-6 mr-3 text-blue-600" />
                      Common Questions
                    </h3>
                    <div className="space-y-6">
                      {countryData.faq.map((item, index) => (
                        <div key={index}>
                          <h4 className="font-semibold text-gray-800">{item.q}</h4>
                          <p className="text-gray-600 mt-1 text-sm">{item.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}

export default VisaRequirementPage;