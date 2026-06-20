import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { getPublishedBlogs } from "@/api/blogApi";

const toSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const COUNTRY_IMAGE_ALIASES = {
  "United Arab Emirates": "uae",
};

const DEFAULT_RECENT_COUNTRY_LIMIT = 12;
const scenicFallbackImage = "https://wallpaperaccess.com/full/2787932.jpg";
const blogFallbackImage =
  "https://png.pngtree.com/thumb_back/fh260/background/20220624/pngtree-flat-lay-of-passport-white-plane-model-and-computer-laptop-on-pastel-blueyellow-and-pink-color-background-and-blank-white-paper-with-copy-space-travel-visa-and-vacation-concept-photo-image_31995348.jpg";

const countryImageModules = import.meta.glob(
  "../assets/images/*.{png,jpg,jpeg,webp,avif}",
  { eager: true, import: "default" }
);

const getCountryImage = (country) => {
  const normalizedName = toSlug(COUNTRY_IMAGE_ALIASES[country] || country);

  const match = Object.entries(countryImageModules).find(([filePath]) => {
    const fileName = filePath
      .split("/")
      .pop()
      ?.replace(/\.[^.]+$/, "");
    return fileName === normalizedName;
  });

  return match?.[1] || scenicFallbackImage;
};

const formatCountryName = (name) => name.toLowerCase().replace(/\s+/g, "-");

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
  const [latestBlogs, setLatestBlogs] = useState([]);

  const destinations = useMemo(() => Object.keys(visaData), [visaData]);

  const filteredDestinations = useMemo(() => {
    const query = checklistSearchTerm.trim().toLowerCase();
    if (!query) {
      return destinations;
    }

    return destinations.filter((country) =>
      country.toLowerCase().includes(query)
    );
  }, [destinations, checklistSearchTerm]);

  const selectedCountryData = selectedDestination
    ? visaData[selectedDestination]
    : null;

  const recentCountries = useMemo(() => {
    const adminSelected = destinations.filter(
      (country) => visaData[country]?.isRecent
    );
    if (adminSelected.length > 0) {
      return adminSelected;
    }

    return destinations.slice(0, DEFAULT_RECENT_COUNTRY_LIMIT);
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
    [selectedCountryData, applicantType]
  );
  const modalChecklistItems = useMemo(
    () => getChecklistItemsByApplicantType(modalCountryData, applicantType),
    [modalCountryData, applicantType]
  );

  useEffect(() => {
    const params = new URLSearchParams(search);
    const destinationFromUrl = params.get("destination");

    if (!destinationFromUrl) {
      return;
    }

    const matchedDestination = destinations.find(
      (country) =>
        toSlug(country) === destinationFromUrl || country === destinationFromUrl
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

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const blogs = await getPublishedBlogs();
        setLatestBlogs((blogs || []).slice(0, 3));
      } catch {
        setLatestBlogs([]);
      }
    };

    fetchLatestBlogs();
  }, []);

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
      (country) => country.toLowerCase() === query
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
    const applicantTypeLabel =
      APPLICANT_TYPE_LABELS[applicantType] || applicantType;

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
      cursorY
    );
    cursorY += 16;
    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-IN")}`,
      margin,
      cursorY
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

      ensureSpace(
        (titleLines.length + descriptionLines.length + 1) * lineHeight
      );
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

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    name: "Stamp2Fly",
    logo: {
      "@type": "ImageObject",
      url: "https://storage.googleapis.com/hostinger-horizons-assets-prod/ac7c5e33-833b-415b-87a1-38b5119ebfe9/d29307835e7b5249a2e33659a636a269.png",
    },
    image:
      "https://storage.googleapis.com/hostinger-horizons-assets-prod/ac7c5e33-833b-415b-87a1-38b5119ebfe9/1e7b9ac90d11a07facf22532137e65d6.png",
    url: "https://www.stamp2fly.com",
    telephone: "+91 88501 89216",
    email: "visa@stamp2fly.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "MASTER MIND 4, Office No A321, C.T.S No 1627, Royal Palm",
      addressLocality: "Goregaon East",
      addressRegion: "Maharashtra",
      postalCode: "400065",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 19.1663,
      longitude: 72.8526,
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    sameAs: [
      "https://www.stamp2fly.com",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Stamp2Fly",
    url: "https://www.stamp2fly.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.stamp2fly.com/?destination={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Helmet>
        <title>Stamp2Fly | Corporate &amp; B2B Visa Processing Partner</title>
        <meta
          name="description"
          content="Stamp2Fly offers corporate & B2B visa processing across India. Expert assistance for tourist & business visas with fast turnaround and transparent pricing."
        />
        <meta
          name="keywords"
          content="corporate visa processing India, B2B visa services, business visa application, visa processing Mumbai, tourist visa India, e-visa assistance"
        />
        <meta property="og:title" content="Stamp2Fly | Corporate & B2B Visa Processing Partner" />
        <meta property="og:description" content="Expert corporate & B2B visa processing across India. Fast turnaround, transparent pricing, and dedicated support." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.stamp2fly.com/" />
        <meta property="og:image" content="https://storage.googleapis.com/hostinger-horizons-assets-prod/ac7c5e33-833b-415b-87a1-38b5119ebfe9/1e7b9ac90d11a07facf22532137e65d6.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Stamp2Fly | Corporate & B2B Visa Processing Partner" />
        <meta name="twitter:description" content="Expert corporate & B2B visa processing across India. Fast turnaround and transparent pricing." />
        <meta name="twitter:image" content="https://storage.googleapis.com/hostinger-horizons-assets-prod/ac7c5e33-833b-415b-87a1-38b5119ebfe9/1e7b9ac90d11a07facf22532137e65d6.png" />
        <link rel="canonical" href="https://www.stamp2fly.com/" />
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      </Helmet>
      <Header />

      <main>
        {/*HERO SECTION*/}
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

        {/* CHECKLIST */}
        <section
          id="checklist"
          className="py-16 sm:py-24 bg-gradient-to-b from-blue-50 to-white"
        >
          <div className="max-w-6xl mx-auto px-4">
            {/* HEADER */}
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight">
                Visa Checklist
              </h2>
              <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                Enter your destination and get a complete visa checklist
                instantly.
              </p>
            </div>

            {/* SEARCH CARD */}
            <div className="mt-10 bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200 p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:items-end">
                {/* INPUT */}
                <div className="md:col-span-7">
                  <label className="text-xs text-gray-500 mb-2 block">
                    Destination
                  </label>
                  <Input
                    type="text"
                    value={checklistSearchTerm}
                    onChange={(e) => setChecklistSearchTerm(e.target.value)}
                    placeholder="e.g., Singapore, UAE, Canada"
                    className="rounded-xl h-11 border-gray-300"
                  />
                </div>

                {/* SELECT */}
                <div className="md:col-span-3">
                  <label className="text-xs text-gray-500 mb-2 block border-gray-400">
                    Applicant Type
                  </label>
                  <Select
                    value={applicantType}
                    onValueChange={setApplicantType}
                  >
                    <SelectTrigger className="w-full rounded-xl h-11">
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

                {/* CTA */}
                <div className="md:col-span-2">
                  <Button
                    onClick={handleShowChecklist}
                    className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  >
                    Show
                  </Button>
                </div>
              </div>

              {/* SUGGESTIONS */}
              {checklistSearchTerm.trim() && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {filteredDestinations.slice(0, 8).map((country) => (
                    <button
                      key={country}
                      onClick={() => {
                        setSelectedDestination(country);
                        setChecklistSearchTerm(country);
                        setHasSearchedChecklist(true);
                      }}
                      className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition shadow-sm"
                    >
                      {visaData[country]?.flag} {country}
                    </button>
                  ))}
                </div>
              )}

              {/* ERROR */}
              {checklistSearchTerm.trim() &&
                filteredDestinations.length === 0 && (
                  <p className="mt-4 text-sm text-red-500">
                    No destination found. Try again.
                  </p>
                )}
            </div>

            {/* RESULTS */}
            {hasSearchedChecklist && selectedCountryData && (
              <div className="mt-10 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
                {/* TOP BAR */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6 mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {selectedCountryData.flag} {selectedDestination}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedCountryData.options?.[0]?.name || "Tourist Visa"}
                    </p>
                  </div>

                  <div className="flex items-center text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
                    <Clock className="h-4 w-4 mr-2" />
                    {selectedCountryData.options?.[0]?.processingTime ||
                      "Varies"}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* CHECKLIST */}
                  <div className="lg:col-span-2">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Checklist
                    </h4>

                    <ul className="space-y-4">
                      {selectedChecklistItems.map((item) => (
                        <li key={item.key} className="flex gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* SIDE PANEL */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 border rounded-xl p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Quick Info
                      </h4>
                      <p className="text-sm text-gray-600">
                        Entry:{" "}
                        {selectedCountryData.options?.[0]?.entry || "Varies"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Validity:{" "}
                        {selectedCountryData.options?.[0]?.validity || "Varies"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Duration:{" "}
                        {selectedCountryData.options?.[0]?.duration || "Varies"}
                      </p>
                    </div>

                    <Button
                      onClick={handleDownloadChecklistPdf}
                      variant="outline"
                      className="w-full rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      Download PDF
                      <Download className="h-4 w-4 ml-2" />
                    </Button>

                    <Button
                      onClick={() => handleApply(selectedDestination)}
                      className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                    >
                      Apply Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="recent-countries" className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            {/* HEADER */}
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
                  Recent Countries
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Explore visa requirements instantly
                </p>
              </div>
            </div>

            {/* SCROLL WRAPPER (IMPORTANT) */}
            <div className="-mx-4 px-4 overflow-x-auto no-scrollbar">
              <div className="flex gap-6 pb-3 snap-x snap-mandatory">
                {panoramaCountries.map((country, index) => (
                  <button
                    key={`${country}-${index}`}
                    onClick={() => openCountryModal(country)}
                    className="group snap-start min-w-[320px] sm:min-w-[380px] md:min-w-[420px] text-left rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition"
                  >
                    {/* IMAGE */}
                    <div className="relative h-52 sm:h-56 overflow-hidden">
                      <img
                        src={getCountryImage(country)}
                        alt={`${country} visa`}
                        loading="lazy"
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = scenicFallbackImage;
                        }}
                      />

                      {/* OVERLAY */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                      {/* TEXT */}
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="text-xs opacity-80">Explore</p>
                        <h3 className="text-xl font-semibold">{country}</h3>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-5">
                      <p className="text-sm text-gray-600">
                        {visaData[country]?.options?.[0]?.name ||
                          "Tourist Visa"}
                      </p>

                      <div className="mt-3 flex items-center text-sm font-medium text-blue-600">
                        View details
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Latest Blogs */}
        <section
          id="blog"
          className="py-12 sm:py-20 bg-slate-50 border-t border-slate-200"
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  Latest from our Blog
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Curated travel insights, visa updates, and practical guidance
                  from our team.
                </p>
              </div>
              <Link
                to="/blogs"
                className="text-sm font-medium text-blue-700 hover:text-blue-800"
              >
                View all blogs
              </Link>
            </div>

            {latestBlogs.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center text-sm text-slate-500">
                Blog posts will appear here once published by the team.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {latestBlogs.map((blog) => (
                  <article
                    key={blog._id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
                  >
                    <img
                      src={blog.coverImage || blogFallbackImage}
                      alt={blog.title}
                      loading="lazy"
                      className="h-44 w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = scenicFallbackImage;
                      }}
                    />
                    <div className="p-5">
                      <p className="text-xs text-slate-500 mb-2">
                        {blog.publishedAt
                          ? new Date(blog.publishedAt).toLocaleDateString()
                          : "Published"}
                      </p>
                      <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                        {blog.excerpt ||
                          "Read the full blog for detailed insights and updates."}
                      </p>
                      <Link
                        to={`/blogs/${blog.slug}`}
                        className="inline-flex mt-4 text-sm font-medium text-blue-700 hover:text-blue-800"
                      >
                        Read article
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
