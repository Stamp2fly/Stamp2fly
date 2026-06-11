import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import WhatsAppButton from "../components/WhatsAppButton";
import MapEmbed from "../components/MapEmbed";
import BackButton from "../components/BackButton";
import BackToHomeButton from "../components/BackHomePage";

const ContactPage = () => {
	// To integrate a toast notification system that provides users with immediate feedback when they submit the contact form, enhancing user experience and engagement.
	const { toast } = useToast();

	const handleSubmit = (e) => {
		e.preventDefault();
		// Using of the toast notification system
		toast({
			title: "Message Sent!",
			description:
				"Thank you for contacting us. We'll get back to you shortly.",
			className: "bg-green-500 text-white",
		});
		e.target.reset();
	};

	return (
		<>
			<Helmet>
				<title>Contact Stamp2Fly | Visa Services Mumbai India</title>
				<meta name="description" content="Reach Stamp2Fly's visa experts by phone, email, or visit our Mumbai office. We offer 24/7 support for visa applications and document requirements." />
				<link rel="canonical" href="https://www.stamp2fly.com/contact" />
				<meta property="og:title" content="Contact Stamp2Fly | Visa Services Mumbai India" />
				<meta property="og:description" content="Reach Stamp2Fly's visa experts by phone, email, or visit our Mumbai office for 24/7 visa application support." />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://www.stamp2fly.com/contact" />
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:title" content="Contact Stamp2Fly | Visa Services Mumbai India" />
				<meta name="twitter:description" content="Reach Stamp2Fly's visa experts by phone, email, or visit our Mumbai office for 24/7 visa application support." />
				<script type="application/ld+json">{JSON.stringify({
					"@context": "https://schema.org",
					"@type": "LocalBusiness",
					name: "Stamp2Fly",
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
					openingHoursSpecification: {
						"@type": "OpeningHoursSpecification",
						dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
						opens: "09:00",
						closes: "18:00",
					},
				})}</script>
			</Helmet>

			<Header />

			{/* Main content */}
			<main className="bg-white">
				{/* Get in touch section */}
				<BackButton/>
				<section className="py-20 bg-gradient-to-br from-blue-50 to-white">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
						>
							<Mail className="mx-auto h-12 w-12 text-blue-600 mb-4" />
							<h1 className="text-4xl md:text-5xl font-bold text-gray-900">
								Get In Touch
							</h1>
							<p className="mt-4 text-xl text-gray-600">
								We're here to help with any questions you may have.
							</p>
						</motion.div>
					</div>
				</section>

				{/* Contact Information Section */}
				<section className="py-16">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5 }}
							>
								<h2 className="text-3xl font-bold text-gray-900 mb-6">
									Contact Information
								</h2>
								<div className="space-y-6">
									<div className="flex items-start space-x-4">
										<div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
											<Phone className="w-6 h-6 text-blue-600" />
										</div>
										<div>
											<h3 className="text-lg font-semibold">Phone</h3>
											<p className="text-gray-600">+918850189216</p>
										</div>
									</div>
									<div className="flex items-start space-x-4">
										<div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
											<Mail className="w-6 h-6 text-blue-600" />
										</div>
										<div>
											<h3 className="text-lg font-semibold">Email</h3>
											<p className="text-gray-600">visa@stamp2fly.com</p>
										</div>
									</div>
									<div className="flex items-start space-x-4">
										<div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
											<MapPin className="w-6 h-6 text-blue-600" />
										</div>
										<div className="w-full">
											<h3 className="text-lg font-semibold">Address</h3>
											<p className="text-gray-600 mb-4">
												MASTER MIND 4, OFFICE NO A321, C.T.S NO 1627, ROYAL
												PALM. GOREGAON EAST MUMBAI BORIVALI 400065
											</p>
											<MapEmbed/>

											{/* <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
												<iframe
													src="https://maps.google.com/maps?q=Master%20Mind%204,%20Royal%20Palm,%20Goregaon%20East,%20Mumbai&t=&z=15&ie=UTF8&iwloc=&output=embed"
													width="100%"
													height="250"
													style={{ border: 0 }}
													allowFullScreen=""
													loading="lazy"
													referrerPolicy="no-referrer-when-downgrade"
													title="Stamp2Fly Office Location"
												/>
											</div>
											<a
												href="https://maps.google.com/?q=MASTER+MIND+4,+OFFICE+NO+A321,+ROYAL+PALM,+GOREGAON+EAST,+MUMBAI+400065"
												target="_blank"
												rel="noopener noreferrer"
												className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-700 underline"
											>
												Open in Google Maps
											</a> */}
										</div>
									</div>
								</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5, delay: 0.1 }}
								className="bg-gray-50 p-8 rounded-2xl"
							>
								{/* Form Section on the right */}
								<h2 className="text-3xl font-bold text-gray-900 mb-6">
									Send us a Message
								</h2>
								<form onSubmit={handleSubmit} className="space-y-6">
									<div>
										<Label htmlFor="name">Full Name</Label>
										<Input
											id="name"
											type="text"
											placeholder="John Doe"
											className="mt-2 rounded-xl"
											required
										/>
									</div>

									<div>
										<Label htmlFor="email">Email Address</Label>
										<Input
											id="email"
											type="email"
											placeholder="you@example.com"
											className="mt-2 rounded-xl"
											required
										/>
									</div>

									<div>
										<Label htmlFor="message">Message</Label>
										<textarea
											id="message"
											rows="5"
											placeholder="Tell us how we can help..."
											className="mt-2 w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
											required
										/>
									</div>

									<Button
										type="submit"
										className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-xl"
									>
										<Send className="mr-2 h-5 w-5" />
										Send Message
									</Button>
								</form>
							</motion.div>
						</div>
					</div>
				</section>
				<BackToHomeButton />
			</main>
			<Footer />
		</>
	);
};

export default ContactPage;
