import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import VisaSearch from "@/components/VisaSearch";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  FileText,
  HelpCircle,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { useVisa } from "@/contexts/VisaContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  APPLICANT_TYPE_LABELS,
  APPLICANT_TYPE_OPTIONS,
} from "@/constants/applicantTypes.js";
import WhatsAppButton from "../components/WhatsAppButton";

const toSlug = (value) => value.toLowerCase().replace(/\s+/g, "-");
const COUNTRY_SCENIC_QUERIES = {
  "United Arab Emirates": "Burj Khalifa Dubai skyline",
  Australia: "Sydney Opera House harbor",
  Singapore: "Marina Bay Sands skyline",
  "United States": "Statue of Liberty New York skyline",
  "United Kingdom": "Big Ben London",
  Canada: "CN Tower Toronto skyline",
  India: "Gateway of India Mumbai",
  Taiwan: "Taipei 101 skyline",
};

const countryImageUrl = (country) =>
  `https://source.unsplash.com/900x600/?${encodeURIComponent(COUNTRY_SCENIC_QUERIES[country] || `${country} famous landmark travel`)}`;
const scenicFallbackImage =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80";

const getChecklistItemsByApplicantType = (countryData, applicantType) => {
  const baseItems = countryData?.checklist?.base || [];
  const applicantItems = countryData?.checklist?.[applicantType] || [];

  const uniqueByKey = new Map();
  [...baseItems, ...applicantItems].forEach((item) => {
    uniqueByKey.set(item.key, item);
  });

  return Array.from(uniqueByKey.values());
};

function HomePage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { visaData } = useVisa();

  const [checklistSearchTerm, setChecklistSearchTerm] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [hasSearchedChecklist, setHasSearchedChecklist] = useState(false);
  const [modalDestination, setModalDestination] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicantType, setApplicantType] = useState("employed");

  const destinations = useMemo(() => Object.keys(visaData), [visaData]);

  const filteredDestinations = useMemo(() => {
    const query = checklistSearchTerm.trim().toLowerCase();
    if (!query) {
      return destinations;
    }

    return destinations.filter((country) =>
      country.toLowerCase().includes(query),
    );
  }, [destinations, checklistSearchTerm]);

  const selectedCountryData = selectedDestination
    ? visaData[selectedDestination]
    : null;

  const recentCountries = useMemo(() => {
    const adminSelected = destinations.filter(
      (country) => visaData[country]?.isRecent,
    );
    if (adminSelected.length > 0) {
      return adminSelected;
    }

    return destinations.slice(0, 8);
  }, [destinations, visaData]);

  const panoramaCountries = useMemo(() => {
    if (recentCountries.length === 0) {
      return [];
    }

    return [...recentCountries, ...recentCountries];
  }, [recentCountries]);

  const modalCountryData = modalDestination ? visaData[modalDestination] : null;
  const selectedChecklistItems = useMemo(
    () => getChecklistItemsByApplicantType(selectedCountryData, applicantType),
    [selectedCountryData, applicantType],
  );
  const modalChecklistItems = useMemo(
    () => getChecklistItemsByApplicantType(modalCountryData, applicantType),
    [modalCountryData, applicantType],
  );

  useEffect(() => {
    const params = new URLSearchParams(search);
    const destinationFromUrl = params.get("destination");

    if (!destinationFromUrl) {
      return;
    }

    const matchedDestination = destinations.find(
      (country) =>
        toSlug(country) === destinationFromUrl ||
        country === destinationFromUrl,
    );

    if (matchedDestination) {
      setSelectedDestination(matchedDestination);
      setChecklistSearchTerm(matchedDestination);
      setHasSearchedChecklist(true);
      const section = document.getElementById("checklist");
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      }
    }
  }, [search, destinations]);

  const handleApply = (destinationName) => {
    navigate("/pricing", {
      state: { destination: destinationName, nationality: "India" },
    });
  };

  const openCountryModal = (country) => {
    setModalDestination(country);
    setIsModalOpen(true);
  };

  const moveToChecklist = (country) => {
    setSelectedDestination(country);
    setChecklistSearchTerm(country);
    setHasSearchedChecklist(true);
    setIsModalOpen(false);

    const checklistSection = document.getElementById("checklist");
    if (checklistSection) {
      checklistSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleShowChecklist = () => {
    const query = checklistSearchTerm.trim().toLowerCase();

    const exactMatch = destinations.find(
      (country) => country.toLowerCase() === query,
    );
    const targetDestination = exactMatch || filteredDestinations[0] || "";

    if (!targetDestination) {
      setSelectedDestination("");
      setHasSearchedChecklist(true);
      return;
    }

    setSelectedDestination(targetDestination);
    setChecklistSearchTerm(targetDestination);
    setHasSearchedChecklist(true);
  };

  const handleDownloadChecklistPdf = () => {
    if (!selectedCountryData || !selectedDestination) {
      return;
    }

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48;
    const contentWidth = pageWidth - margin * 2;
    const lineHeight = 18;
    const applicantTypeLabel = APPLICANT_TYPE_LABELS[applicantType] ||
      applicantType;

    let cursorY = margin;
    const ensureSpace = (requiredHeight = lineHeight) => {
      if (cursorY + requiredHeight > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
      }
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Stamp2Fly Visa Checklist", margin, cursorY);
    cursorY += 28;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Destination: ${selectedDestination}`, margin, cursorY);
    cursorY += 16;
    doc.text(`Applicant Type: ${applicantTypeLabel}`, margin, cursorY);
    cursorY += 16;
    doc.text(
      `Visa Type: ${selectedCountryData.options?.[0]?.name || "Tourist Visa"}`,
      margin,
      cursorY,
    );
    cursorY += 16;
    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-IN")}`,
      margin,
      cursorY,
    );
    cursorY += 24;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Checklist", margin, cursorY);
    cursorY += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    selectedChecklistItems.forEach((item, index) => {
      const itemTitle = `${index + 1}. ${item.name}`;
      const titleLines = doc.splitTextToSize(itemTitle, contentWidth);
      const descriptionLines = item.description
        ? doc.splitTextToSize(`- ${item.description}`, contentWidth - 12)
        : [];

      ensureSpace((titleLines.length + descriptionLines.length + 1) * lineHeight);
      doc.text(titleLines, margin, cursorY);
      cursorY += titleLines.length * lineHeight;

      if (descriptionLines.length > 0) {
        doc.setTextColor(70, 70, 70);
        doc.text(descriptionLines, margin + 12, cursorY);
        doc.setTextColor(0, 0, 0);
        cursorY += descriptionLines.length * lineHeight;
      }

      cursorY += 6;
    });

    const safeDestination = toSlug(selectedDestination);
    doc.save(`stamp2fly-${safeDestination}-checklist.pdf`);
  };

  // Structured data for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Stamp2Fly",
    image:
      "https://storage.googleapis.com/hostinger-horizons-assets-prod/ac7c5e33-833b-415b-87a1-38b5119ebfe9/1e7b9ac90d11a07facf22532137e65d6.png",
    url: "https://www.stamp2fly.com",
    telephone: "+91 88501 89216",
    address: {
      "@type": "PostalAddress",
      streetAddress: "MASTER MIND 4, Office No A321, C.T.S No 1627, Royal Palm",
      addressLocality: "Goregaon East",
      addressRegion: "Mumbai, Maharashtra",
      postalCode: "400065",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };

  return (
    <>
      <Helmet>
        <title>
          Visa Services in India | Fast & Simple Online Visa Assistance -
          Stamp2Fly
        </title>
        <meta
          name="description"
          content="Apply for tourist and business visas online with Stamp2Fly. Fast processing, transparent pricing, and expert visa assistance across India. Get your visa hassle-free today!"
        />

        <meta
          name="keywords"
          content="visa services, visa application, e-visa, fast visa, simple visa, visa online"
        />
        <meta
          property="og:title"
          content="Visa Services in India | Stamp2Fly"
        />
        <meta
          property="og:description"
          content="Fast and reliable visa assistance across India."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.stamp2fly.com/" />
        <meta
          property="og:image"
          content="https://www.stamp2fly.com/og-image.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Visa Services in India - Stamp2Fly"
        />
        <meta
          name="twitter:description"
          content="Apply for visas online with expert support."
        />
        <meta
          name="twitter:image"
          content="https://www.stamp2fly.com/og-image.jpg"
        />
        <link rel="canonical" href="https://www.stamp2fly.com/" />
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>

      <Header />

      <main>
        {/* ================= HERO SECTION ================= */}
        <section
          className="relative min-h-[100vh] flex flex-col items-center justify-center text-center bg-cover bg-center"
          style={{ backgroundImage: "url('/world-map.png')" }}
          mode="apply"
          id="apply"
        >
          {/* Soft overlay */}
          <div className="absolute inset-0 bg-white/50"></div>

          {/* Hero Content */}
          <div className="relative z-10 w-full px-4 mt-30">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-2xl sm:text-4xl md:text-6xl font-bold text-gray-900 tracking-tight"
            >
              Visa Services, Fast & Simple
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto"
            >
              Get your visa, hassle-free with expert support and transparent
              pricing.
            </motion.p>
          </div>

          {/* Floating Apply Card */}
          <div className="relative z-20 w-full max-w-md sm:max-w-5xl px-4 sm:px-6 mt-6 sm:mt-8 md:mt-10">
            <div className="bg-white shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 w-full">
              <p className="mt-0 text-xs sm:text-sm md:text-base text-gray-600 text-center">
                Start your visa application in minutes.
              </p>

              <div className="mt-8 w-full">
                <VisaSearch />
              </div>
            </div>
          </div>
        </section>

        <section id="checklist" className="py-12 sm:py-20 md:py-28 bg-blue-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                Visa Checklist
              </h2>
              <p className="mt-3 sm:mt-4 md:mt-6 text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Search your destination and instantly view a quick summary with
                the required checklist.
              </p>
            </div>

            <div className="mt-8 bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:items-end">
                <div className="md:col-span-8">
                  <p className="text-xs text-gray-500 mb-2">
                    Search destination
                  </p>
                  <Input
                    type="text"
                    value={checklistSearchTerm}
                    onChange={(e) => setChecklistSearchTerm(e.target.value)}
                    placeholder="Type destination (e.g., Singapore, UAE, Canada)"
                  />
                </div>
                <div className="md:col-span-4">
                  <Select value={applicantType} onValueChange={setApplicantType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {APPLICANT_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-12 flex md:justify-start">
                  <Button
                    onClick={handleShowChecklist}
                    className="w-full md:w-full md:min-w-[220px] bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Show Checklist
                  </Button>
                </div>
              </div>

              {checklistSearchTerm.trim() && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filteredDestinations.slice(0, 8).map((country) => (
                    <button
                      key={country}
                      onClick={() => {
                        setSelectedDestination(country);
                        setChecklistSearchTerm(country);
                        setHasSearchedChecklist(true);
                      }}
                      className="px-3 py-1.5 rounded-full border border-blue-200 text-blue-700 text-sm hover:bg-blue-50 transition"
                    >
                      {visaData[country]?.flag} {country}
                    </button>
                  ))}
                </div>
              )}

              {checklistSearchTerm.trim() &&
                filteredDestinations.length === 0 && (
                  <p className="mt-4 text-sm text-red-600">
                    No destination found. Try a different spelling.
                  </p>
                )}
            </div>

            {hasSearchedChecklist && selectedCountryData && (
              <div className="mt-8 bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-5 mb-5">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      {selectedCountryData.flag} {selectedDestination}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedCountryData.options?.[0]?.name || "Tourist Visa"}{" "}
                      for Indian applicants
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-700 bg-blue-50 px-4 py-2 rounded-lg">
                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                    {selectedCountryData.options?.[0]?.processingTime ||
                      "Varies"}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h4 className="font-semibold text-gray-900 flex items-center mb-4">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      Checklist
                    </h4>
                    <ul className="space-y-3">
                      {selectedChecklistItems.map((item) => (
                        <li key={item.key} className="flex items-start">
                          <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <HelpCircle className="h-4 w-4 mr-2 text-blue-600" />
                        Quick Summary
                      </h4>
                      <p className="text-sm text-gray-700">
                        Entry:{" "}
                        {selectedCountryData.options?.[0]?.entry || "Varies"}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        Validity:{" "}
                        {selectedCountryData.options?.[0]?.validity || "Varies"}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        Duration:{" "}
                        {selectedCountryData.options?.[0]?.duration ||
                          selectedCountryData.options?.[0]?.stay ||
                          "Varies"}
                      </p>
                    </div>

                    {selectedCountryData.source && (
                      <a
                        href={selectedCountryData.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-700 hover:text-blue-800 font-medium"
                      >
                        Official Source
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    )}

                    <Button
                      onClick={handleDownloadChecklistPdf}
                      variant="outline"
                      className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      Download Checklist PDF
                      <Download className="h-4 w-4 ml-2" />
                    </Button>

                    <Button
                      onClick={() => handleApply(selectedDestination)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Apply for {selectedDestination}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="recent-countries" className="py-12 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  Recent Countries
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Click a country to view a quick requirements popup.
                </p>
              </div>
            </div>

            <div className="panorama-shell no-scrollbar pb-3">
              <div className="panorama-track">
                {panoramaCountries.map((country, index) => (
                  <button
                    key={`${country}-${index}`}
                    onClick={() => openCountryModal(country)}
                    className="panorama-card min-w-[280px] sm:min-w-[320px] md:min-w-[360px] text-left bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition"
                  >
                    <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-100 border border-blue-100">
                      <img
                        src={countryImageUrl(country)}
                        alt={`${country} travel view`}
                        className="w-full h-full object-cover"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = scenicFallbackImage;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/10 to-transparent" />
                      <div className="absolute bottom-3 left-3 text-white text-xs font-medium tracking-wide bg-white/15 backdrop-blur px-2 py-1 rounded-md">
                        Explore {country}
                      </div>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-gray-900">
                      {country}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {visaData[country]?.options?.[0]?.name || "Tourist Visa"}
                    </p>
                    <div className="mt-4 inline-flex items-center text-sm font-medium text-blue-700">
                      View details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
        <WhatsAppButton />
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl bg-white text-slate-900 border-slate-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle>
              {modalCountryData?.flag} {modalDestination} Visa Requirements
            </DialogTitle>
            <DialogDescription className="text-slate-700">
              Quick summary with key checklist for Indian applicants.
            </DialogDescription>
          </DialogHeader>

          {modalCountryData && (
            <div className="space-y-4">
              <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 text-sm text-slate-800">
                <p>
                  Visa Type:{" "}
                  {modalCountryData.options?.[0]?.name || "Tourist Visa"}
                </p>
                <p className="mt-1">
                  Processing:{" "}
                  {modalCountryData.options?.[0]?.processingTime || "Varies"}
                </p>
                <p className="mt-1">
                  Validity:{" "}
                  {modalCountryData.options?.[0]?.validity || "Varies"}
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Checklist</h4>
                <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {modalChecklistItems.map((item) => (
                    <li
                      key={item.key}
                      className="flex items-start text-sm text-gray-700"
                    >
                      <CheckCircle className="h-4 w-4 mt-0.5 mr-2 text-green-600" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => moveToChecklist(modalDestination)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Use in Checklist Section
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}

export default HomePage;
