import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
	CheckCircle,
	ArrowRight,
	Info,
	Sparkles,
	AlertTriangle,
	HelpCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useVisa } from "@/contexts/VisaContext";
import { cn } from "@/lib/utils";
import BackButton from "../components/BackButton";
import WhatsAppButton from "../components/WhatsAppButton";
import BackToHomeButton from "../components/BackHomePage";

function PricingPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const { visaData } = useVisa();
	const searchData = location.state || {};
	const countryData = visaData[searchData.destination];

	const [selectedOptionId, setSelectedOptionId] = useState(null);

	React.useEffect(() => {
		if (countryData && countryData.options && countryData.options.length > 0) {
			setSelectedOptionId(countryData.options[0].id);
		}
	}, [countryData]);

	if (
		!countryData ||
		!countryData.options ||
		countryData.options.length === 0
	) {
		navigate("/apply", {
			state: { ...searchData, destination: searchData.destination },
		});
		return null;
	}

	const selectedOption = countryData.options.find(
		(opt) => opt.id === selectedOptionId,
	);

	const handleApplyNow = () => {
		if (selectedOption) {
			navigate("/apply", {
				state: {
					...searchData,
					visaDetails: countryData,
					selectedVisaOption: selectedOption,
				},
			});
		}
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	const getEntry = (option) => option.entry || option.entryType || "Varies";
	const getDuration = (option) => option.duration || option.stay || "Varies";

	return (
		<>
			<Helmet>
				<title>{searchData.destination ? `${searchData.destination} Visa Pricing & Options | Stamp2Fly` : 'Visa Pricing | Stamp2Fly'}</title>
				<meta
					name="description"
					content={searchData.destination ? `View ${searchData.destination} visa pricing, processing times, and requirements. Choose the right visa option and apply online with Stamp2Fly.` : 'View visa pricing, processing times, and requirements for all destinations. Apply online with Stamp2Fly.'}
				/>
				{searchData.destination && (
					<link rel="canonical" href={`https://www.stamp2fly.com/pricing`} />
				)}
			</Helmet>

			<Header />
			<BackButton />
			<main className="bg-slate-50">
				<section className="py-12 sm:py-16 md:py-24">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="text-center mb-8 sm:mb-12"
						>
							<h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
								{countryData.flag} {searchData.destination} Visa Options
							</h1>
							<p className="text-lg text-gray-600 max-w-2xl mx-auto">
								Select your preferred visa type. All prices are for{" "}
								{searchData.travelers || 1} traveler(s).
							</p>
						</motion.div>

						{/* options list; allow horizontal scroll on tiny devices */}
						<div className="space-y-4 sm:space-y-6 overflow-x-auto">
							{countryData.options.map((option) => (
								<motion.div
									key={option.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2, duration: 0.5 }}
									className={cn(
										"bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 overflow-hidden",
										option.id === selectedOptionId
											? "border-emerald-500"
											: "border-transparent",
										option.combo ? "border-green-500" : "",
									)}
								>
									<div
										className={cn(
											"p-4 text-white font-semibold",
											option.combo ? "bg-green-600" : "bg-blue-600",
										)}
									>
										<h2 className="text-lg flex items-center">
											{option.combo && <Sparkles className="w-5 h-5 mr-2" />}
											{option.name}
										</h2>
									</div>

									{option.alertMessage && (
										<div className="bg-yellow-100 text-yellow-800 p-3 text-sm https://docs.google.com/forms/d/e/1FAIpQLSeAwme3eG1zGWB_iFG21uxeYqphSb1LQb85Ey9zeRg63Wacxg/viewform?usp=publish-editorflex items-center">
											<AlertTriangle className="w-5 h-5 mr-3" />
											<span>{option.alertMessage}</span>
										</div>
									)}

									<div className="p-6">
										<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 items-center">
											<div className="text-center">
												<p className="text-sm text-gray-500">Entry</p>
												<p className="font-semibold text-gray-800">
													{getEntry(option)}
												</p>
											</div>
											<div className="text-center">
												<p className="text-sm text-gray-500">Validity</p>
												<p className="font-semibold text-gray-800">
													{option.validity}
												</p>
											</div>
											<div className="text-center">
												<p className="text-sm text-gray-500">Duration</p>
												<p className="font-semibold text-gray-800">
													{getDuration(option)}
												</p>
											</div>
											<div className="text-center">
												<p className="text-sm text-gray-500">Processing</p>
												<p className="font-semibold text-gray-800">
													{option.processingTime}
												</p>
											</div>
											<div className="text-center md:col-span-2 sm:col-span-2 flex flex-col sm:flex-row items-center justify-center gap-4">
												<div className="text-right">
													{option.originalPrice && (
														<p className="text-sm text-gray-500 line-through">
															{formatCurrency(option.originalPrice)}
														</p>
													)}
													<p className="text-2xl font-bold text-gray-900">
														{formatCurrency(option.price)}
													</p>
													{option.originalPrice && (
														<p className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full inline-block">
															Save{" "}
															{formatCurrency(
																option.originalPrice - option.price,
															)}
														</p>
													)}
												</div>
												<Button
													onClick={() => setSelectedOptionId(option.id)}
													variant={
														option.id === selectedOptionId
															? "default"
															: "outline"
													}
													size="lg"
													className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
												>
													{option.id === selectedOptionId
														? "Selected"
														: "Select"}
												</Button>
											</div>
										</div>
										{option.fees && (
											<div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600 flex items-center">
												<Info className="w-4 h-4 mr-2" />
												Absconding fees: {option.fees.absconding}
											</div>
										)}
									</div>
								</motion.div>
							))}
						</div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4, duration: 0.5 }}
							className="mt-8 sm:mt-12 bg-white p-8 rounded-2xl shadow-md border"
						>
							<h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
								What's Included in Our Service
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{[
									"Government Fees Included",
									"Expert Application Review",
									"24/7 Customer Support",
									"Secure Document Handling",
									"Application Status Tracking",
									"Peace of Mind Guarantee",
								].map((item) => (
									<div key={item} className="flex items-center space-x-3">
										<CheckCircle className="w-6 h-6 flex-shrink-0 text-emerald-500" />
										<span className="text-gray-700">{item}</span>
									</div>
								))}
							</div>
						</motion.div>

						{countryData.faq?.length > 0 && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.45, duration: 0.5 }}
								className="mt-8 bg-white p-8 rounded-2xl shadow-md border"
							>
								<h3 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
									<HelpCircle className="w-6 h-6 mr-2 text-blue-600" />
									Frequently Asked Questions
								</h3>
								<div className="space-y-4">
									{countryData.faq.map((item, index) => (
										<div key={`${item.q}-${index}`} className="rounded-xl border border-gray-200 bg-slate-50 p-5">
											<h4 className="text-base font-semibold text-gray-900">{item.q}</h4>
											<p className="text-sm text-gray-700 mt-2 leading-relaxed">{item.a}</p>
										</div>
									))}
								</div>
							</motion.div>
						)}

						<div className="mt-10 text-center">
							<Button
								size="lg"
								onClick={handleApplyNow}
								disabled={!selectedOption}
								className="w-full max-w-xs mx-auto bg-blue-600 hover:bg-blue-700 text-white"
							>
								Continue to Document Upload
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						</div>
					</div>
				</section>
				{/* <WhatsAppButton /> */}
				<BackToHomeButton/>
			</main>
			<Footer />
		</>
	);
}

export default PricingPage;
