import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import VisaSearch from "@/components/VisaSearch";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import WhatsAppButton from "../components/WhatsAppButton";

function HomePage() {
	const navigate = useNavigate();

	// Structured data for SEO
	const organizationSchema = {
		"@context": "https://schema.org",
		"@type": "TravelAgency",
		"name": "Stamp2Fly",
		"image": "https://storage.googleapis.com/hostinger-horizons-assets-prod/ac7c5e33-833b-415b-87a1-38b5119ebfe9/1e7b9ac90d11a07facf22532137e65d6.png",
		"url": "https://www.stamp2fly.com",
		"telephone": "+91 88501 89216",
		"address": {
			"@type": "PostalAddress",
			"streetAddress": "MASTER MIND 4, Office No A321, C.T.S No 1627, Royal Palm",
			"addressLocality": "Goregaon East",
			"addressRegion": "Mumbai, Maharashtra",
			"postalCode": "400065",
			"addressCountry": "IN"
		},
		"areaServed": {
			"@type": "Country",
			"name": "India"
		}
	};

	return (
		<>
			<Helmet>
				<title>Visa Services in India | Fast & Simple Online Visa Assistance - Stamp2Fly</title>
				<meta
					name="description"
					content="Apply for tourist and business visas online with Stamp2Fly. Fast processing, transparent pricing, and expert visa assistance across India. Get your visa hassle-free today!"
				/>
				
				<meta
					name="keywords"
					content="visa services, visa application, e-visa, fast visa, simple visa, visa online"
				/>
				<meta property="og:title" content="Visa Services in India | Stamp2Fly" />
				<meta property="og:description" content="Fast and reliable visa assistance across India." />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://www.stamp2fly.com/" />
				<meta property="og:image" content="https://www.stamp2fly.com/og-image.jpg" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Visa Services in India - Stamp2Fly" />
				<meta name="twitter:description" content="Apply for visas online with expert support." />
				<meta name="twitter:image" content="https://www.stamp2fly.com/og-image.jpg" />
				<link rel="canonical" href="https://www.stamp2fly.com/" />
				<script type="application/ld+json">
					{JSON.stringify(organizationSchema)}
				</script>
			</Helmet>

			<Header />

			<main>
				{/* ================= HERO SECTION ================= */}
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
							className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight"
						>
							{/* Get your visa, hassle-free */}
							Fast & Simple Online Visa Application Services
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.7, delay: 0.2 }}
							className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto"
						>
							{/* We’ve helped thousands of people get their visas. We can help you
							get yours, too. */}
							Get your visa, hassle-free with expert support and transparent pricing.
						</motion.p>
					</div>

					{/* Floating Apply Card */}
					<div className="relative z-20 w-full max-w-5xl px-4 mt-10">
						<div className="bg-white shadow-2xl rounded-3xl p-8 md:p-10">
							<p className="mt-0 text-gray-600 text-center">
								Start your visa application in minutes.
							</p>

							<div className="mt-8">
								<VisaSearch />
							</div>
						</div>
					</div>
				</section>

				{/* ================= CHECKLIST SECTION ================= */}
				<section id="checklist" className="py-28 bg-blue-50">
					<div className="max-w-6xl mx-auto px-4 text-center">
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900">
							Visa Checklist
						</h2>

						<p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
							Before you travel, make sure you have everything you need. Check
							documents, entry rules, and travel requirements instantly.
						</p>

						{/* Cards */}
						<div className="mt-16 grid md:grid-cols-3 gap-8">
							{/* Card 1 */}
							<div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition duration-300">
								<div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 mb-6 mx-auto">
									📄
								</div>
								<h3 className="text-lg font-semibold text-gray-900">
									Required Documents
								</h3>
								<p className="mt-3 text-gray-600 text-sm leading-relaxed">
									Know exactly which documents are required for your
									destination.
								</p>
							</div>

							{/* Card 2 */}
							<div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition duration-300">
								<div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 mb-6 mx-auto">
									🌍
								</div>
								<h3 className="text-lg font-semibold text-gray-900">
									Entry Regulations
								</h3>
								<p className="mt-3 text-gray-600 text-sm leading-relaxed">
									Understand visa types, validity, and stay duration.
								</p>
							</div>

							{/* Card 3 */}
							<div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition duration-300">
								<div className="w-14 h-14 flex items-center justify-center rounded-full bg-pink-100 mb-6 mx-auto">
									🛡️
								</div>
								<h3 className="text-lg font-semibold text-gray-900">
									Travel Updates
								</h3>
								<p className="mt-3 text-gray-600 text-sm leading-relaxed">
									Stay informed about the latest entry and travel policies.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* ================= HOW IT WORKS SECTION ================= */}
				<section
					id="how-it-works"
					className="relative overflow-hidden py-28 bg-gradient-to-b from-blue-50/70 via-white to-white"
				>
					<div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl"></div>
					<div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-cyan-100/50 blur-3xl"></div>

					<div className="relative max-w-6xl mx-auto px-4">
						<div className="text-center">
							<span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold tracking-[0.14em] text-blue-700 uppercase">
								Quick Process
							</span>
							<h2 className="mt-5 text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
								How It Works
							</h2>
							<p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
								Getting your visa is simple. Follow these three steps to
								complete your application with confidence.
							</p>
						</div>

						<div className="relative mt-16 grid gap-6 md:grid-cols-3">
							<div className="hidden md:block absolute left-0 right-0 top-12 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>

							{/* Step 1 */}
							<div className="group relative rounded-3xl border border-blue-100 bg-white/90 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-lg shadow-blue-200">
										1
									</div>
									<span className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
										Step 01
									</span>
								</div>
								<h3 className="mt-6 text-xl font-semibold text-gray-900">
									Choose Your Destination
								</h3>
								<p className="mt-3 text-gray-600 leading-relaxed">
									Select your passport and destination to instantly view visa
									requirements.
								</p>
							</div>

							{/* Step 2 */}
							<div className="group relative rounded-3xl border border-blue-100 bg-white/90 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-lg shadow-blue-200">
										2
									</div>
									<span className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
										Step 02
									</span>
								</div>
								<h3 className="mt-6 text-xl font-semibold text-gray-900">
									Submit Your Application
								</h3>
								<p className="mt-3 text-gray-600 leading-relaxed">
									Complete the form and upload required documents through our
									guided process.
								</p>
							</div>

							{/* Step 3 */}
							<div className="group relative rounded-3xl border border-blue-100 bg-white/90 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-lg shadow-blue-200">
										3
									</div>
									<span className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
										Step 03
									</span>
								</div>
								<h3 className="mt-6 text-xl font-semibold text-gray-900">
									Receive Your eVisa
								</h3>
								<p className="mt-3 text-gray-600 leading-relaxed">
									After approval, your eVisa is delivered directly to your inbox.
								</p>
							</div>
						</div>
					</div>
				</section>
				<WhatsAppButton />
			</main>

			<Footer />
		</>
	);
}

export default HomePage;
