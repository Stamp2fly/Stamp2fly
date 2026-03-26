import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
	groupFaqsByPrimaryTag,
	DEFAULT_FAQS,
} from "@/constants/faqData.js";
import { useFaq } from "@/contexts/FaqContext";
import BackToHomeButton from "../components/BackHomePage";

const FaqItem = ({ q, a }) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="border-b">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex justify-between items-center py-5 text-left"
			>
				<span className="font-semibold text-lg text-gray-800">{q}</span>
				<motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
					<ChevronDown className="w-5 h-5 text-gray-500" />
				</motion.div>
			</button>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="overflow-hidden"
					>
						<p className="pb-5 text-gray-600">{a}</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const FaqPage = () => {
	const { faqs } = useFaq();

	const faqData = useMemo(
		() => groupFaqsByPrimaryTag(faqs.length ? faqs : DEFAULT_FAQS),
		[faqs],
	);
	const categories = useMemo(() => Object.keys(faqData), [faqData]);
	const [activeCategory, setActiveCategory] = useState("General");

	useEffect(() => {
		if (categories.length === 0) {
			setActiveCategory("");
			return;
		}

		if (!categories.includes(activeCategory)) {
			setActiveCategory(categories[0]);
		}
	}, [categories, activeCategory]);

	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: Object.values(faqData)
			.flat()
			.map((item) => ({
				"@type": "Question",
				name: item.q,
				acceptedAnswer: {
					"@type": "Answer",
					text: item.a,
				},
			})),
	};

	return (
		<>
			<Helmet>
				<title>FAQ - Frequently Asked Questions | Stamp2Fly</title>
				<meta
					name="description"
					content="Find answers to frequently asked questions about visa applications, document requirements, processing times, and payment on Stamp2Fly."
				/>
				<link rel="canonical" href="https://www.stamp2fly.com/faq" />
				<script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
			</Helmet>
			<Header />
			<main className="bg-white">
				<section className="py-20 bg-gradient-to-br from-blue-50 to-white">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
						>
							<HelpCircle className="mx-auto h-12 w-12 text-blue-600 mb-4" />
							<h1 className="text-4xl md:text-5xl font-bold text-gray-900">
								Frequently Asked Questions
							</h1>
							<p className="mt-4 text-xl text-gray-600">
								Find answers to common questions about our visa services.
							</p>
						</motion.div>
					</div>
				</section>

				<section className="py-16">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
						{/* <div className="flex justify-center space-x-2 md:space-x-4 mb-12 border-b">
              {Object.keys(faqData).map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 md:px-6 py-3 font-medium text-lg transition-colors ${
                    activeCategory === category
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-blue-500'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div> */}
						<div className="flex justify-center flex-wrap gap-3 mb-14">
							{categories.map((category) => (
								<button
									key={category}
									onClick={() => setActiveCategory(category)}
									className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
										activeCategory === category
											? "bg-blue-600 text-white shadow-md"
											: "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
									}`}
								>
									{category}
								</button>
							))}
						</div>

						<div>
							{(faqData[activeCategory] || []).map((item, index) => (
								<FaqItem key={index} q={item.q} a={item.a} />
							))}
						</div>
					</div>
				</section>
				<BackToHomeButton/>
			</main>
			<Footer />
		</>
	);
};

export default FaqPage;
