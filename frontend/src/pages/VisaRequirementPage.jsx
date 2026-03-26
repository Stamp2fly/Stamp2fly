import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
	CheckCircle,
	HelpCircle,
	FileText,
	XCircle,
	ExternalLink,
	ArrowRight,
	Share2,
	Download,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useVisa } from "@/contexts/VisaContext";
import { Button } from "@/components/ui/button";
import BackButton from "../components/Admin/BackButton";
import WhatsAppButton from "../components/WhatsAppButton";

function VisaRequirementPage() {
	const { destination: destSlug } = useParams();
	const navigate = useNavigate();
	const { search } = useLocation();
	const { visaData } = useVisa();
	const checklistRef = useRef();

	const [countryData, setCountryData] = useState(null);
	const [nationality, setNationality] = useState("India");
	const [destinationName, setDestinationName] = useState("");

	const flagUrl = countryData?.isoCode
		? `https://flagcdn.com/w320/${countryData.isoCode.toLowerCase()}.png`
		: null;

	useEffect(() => {
		const queryParams = new URLSearchParams(search);
		setNationality(queryParams.get("nationality") || "India");

		const foundEntry = Object.entries(visaData).find(
			([name]) => name.toLowerCase().replace(/\s+/g, "-") === destSlug,
		);

		if (foundEntry) {
			setDestinationName(foundEntry[0]);
			setCountryData(foundEntry[1]);
		} else {
			setCountryData(null);
		}
	}, [destSlug, search, visaData]);

	const handleApply = () => {
		navigate("/pricing", {
			state: { destination: destinationName, nationality },
		});
	};

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({
				title: `${destinationName} Visa Checklist`,
				url: window.location.href,
			});
		} else {
			alert("Sharing not supported on this device");
		}
	};

	const handleDownload = () => {
		const printContents = checklistRef.current.innerHTML;
		const printWindow = window.open("", "", "height=600,width=800");

		printWindow.document.write(`
    <html>
      <head>
        <title>${destinationName} Visa Checklist</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h2 {
            margin-bottom: 20px;
          }
          ul {
            list-style: none;
            padding: 0;
          }
          li {
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <h2>${destinationName} Visa Checklist</h2>
        ${printContents}
      </body>
    </html>
  `);

		printWindow.document.close();
		printWindow.focus();
		printWindow.print();
		printWindow.close();
	};

	if (!countryData) {
		return (
			<>
				<Header />
				<main className="min-h-[80vh] bg-gray-50 flex items-center justify-center">
					<div className="text-center">
						<XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
						<h1 className="text-2xl font-bold text-gray-800">
							Visa Information Not Found
						</h1>
						<Button asChild className="mt-6">
							<Link to="/">Go Back Home</Link>
						</Button>
					</div>
				</main>
				<Footer />
			</>
		);
	}

	const primaryOption = countryData.options?.[0] || null;
	const visaTypeName = primaryOption?.name || "Tourist Visa";
	const processingTime = primaryOption?.processingTime || "Varies";

	const pageTitle = `${destinationName} Visa Requirements for ${nationality} Citizens | Stamp2Fly`;

	const documentList = countryData.checklist?.base || [];
	const faqSchema = countryData.faq?.length > 0
		? {
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
		}
		: null;

	return (
		<>
			<Helmet>
				<title>{pageTitle}</title>
				<meta
					name="description"
					content={`Check updated ${destinationName} visa requirements for Indian citizens. View documents required, processing time, eligibility and apply online with Stamp2Fly.`}
				/>
				<link
					rel="canonical"
					href={`https://www.stamp2fly.com/visa-requirements/${destSlug}`}
				/>
				{faqSchema && (
					<script type="application/ld+json">
						{JSON.stringify(faqSchema)}
					</script>
				)}
				<meta property="og:title" content={pageTitle} />
				<meta
					property="og:description"
					content={`Updated ${destinationName} visa requirements for Indian citizens.`}
				/>
				<meta
					property="og:url"
					content={`https://www.stamp2fly.com/visa-requirements/${destSlug}`}
				/>
				<meta property="og:type" content="article" />
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:title" content={pageTitle} />
				<meta
					name="twitter:description"
					content={`Updated ${destinationName} visa requirements for Indian citizens.`}
				/>
			</Helmet>

			<Header />
			<BackButton />


			<main className="bg-gray-50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
					>
						{/* HERO */}
						<div className="bg-white rounded-2xl shadow-md p-10 mb-8 text-center">
							{flagUrl && (
								<div className="flex justify-center mb-4">
									<img
										src={flagUrl}
										alt={destinationName}
										className="w-100 h-300 rounded-md shadow-sm"
									/>
								</div>
							)}

							<h1 className="text-4xl md:text-5xl font-bold text-gray-900">
								{destinationName} Visa Requirements for Indian Citizens
							</h1>

							{/* Category Badge */}
							<div className="mt-4">
								<span className="bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1 rounded-full">
									{visaTypeName}
								</span>
							</div>

							<p className="mt-4 text-lg text-gray-600">
								Complete checklist and processing details for {nationality} passport holders.
							</p>

							{countryData.source && (
								<a
									href={countryData.source}
									target="_blank"
									rel="noopener noreferrer"
									className="mt-4 inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
								>
									Official Government Source
									<ExternalLink className="ml-2 w-4 h-4" />
								</a>
							)}
						</div>

						{/* PROCESSING TIME */}
						<div className="bg-white rounded-2xl shadow-md p-6 mb-8">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Processing Time
							</h2>
							<p className="text-gray-600">
								{processingTime}
							</p>
						</div>

						{/* CTA */}
						<div className="bg-blue-600 text-white rounded-2xl shadow-lg p-8 mb-8 text-center">
							<h3 className="text-2xl font-bold">Ready to apply?</h3>
							<p className="mt-2 opacity-90">
								Our experts will guide you through every step.
							</p>
							<Button
								onClick={handleApply}
								variant="secondary"
								className="mt-6 bg-white text-blue-600 hover:bg-gray-100 px-10"
							>
								See Options & Apply
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						</div>
						
						<p className="mb-6 text-gray-700">
							Below are the latest {destinationName} visa requirements for {nationality} passport holders.
							Ensure all documents are complete before submitting your application to avoid delays.
						</p>

						{/* CHECKLIST */}
						<div
							ref={checklistRef}
							className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mb-8"
						>
							<div className="flex justify-between items-center mb-6">
								<h3 className="text-xl font-bold text-gray-800 flex items-center">
									<FileText className="w-6 h-6 mr-3 text-blue-600" />
									Standard Visa Checklist
								</h3>

								<div className="flex gap-4">
									<button
										onClick={handleDownload}
										className="flex items-center text-sm text-gray-600 hover:text-blue-600"
									>
										<Download className="w-4 h-4 mr-1" />
										Download
									</button>

									<button
										onClick={handleShare}
										className="flex items-center text-sm text-gray-600 hover:text-blue-600"
									>
										<Share2 className="w-4 h-4 mr-1" />
										Share
									</button>
								</div>
							</div>

							<ul className="space-y-4">
								{documentList.map((item) => (
									<li key={item.key} className="flex items-start">
										<CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
										<div>
											<span className="font-medium text-gray-800">
												{item.name}
											</span>
											<p className="text-gray-600 text-sm">
												{item.description}
											</p>
										</div>
									</li>
								))}
							</ul>
						</div>

						{/* FAQ */}
						{countryData.faq?.length > 0 && (
							<div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
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
					</motion.div>
				</div>
				<WhatsAppButton />
			</main>

			<Footer />
		</>
	);
}

export default VisaRequirementPage;
