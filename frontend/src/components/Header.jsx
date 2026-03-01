import { useLocation } from "react-router-dom";
import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Header() {
	const location = useLocation();
	const isHomePage = location.pathname === "/";
	return (
		<header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
			<div className="max-w-1xl mx-auto px-4 sm:px-4 lg:px-8">
				{/* Main Header Row */}
				<div className="flex items-center justify-between h-20">
					{/* LEFT - Logo */}
					<div className="flex items-center">
						<Link to="/" className="flex items-center space-x-2">
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5 }}
								className="flex items-center space-x-2"
							>
								<img
									src="https://storage.googleapis.com/hostinger-horizons-assets-prod/ac7c5e33-833b-415b-87a1-38b5119ebfe9/1e7b9ac90d11a07facf22532137e65d6.png"
									alt="Stamp2Fly Brandmark"
									className="h-8 w-auto"
								/>
								<span className="text-xl font-bold text-gray-800">
									Stamp2Fly
								</span>
							</motion.div>
						</Link>
					</div>

					{/* CENTER - Navigation */}
					{isHomePage && (
						<div className="hidden md:flex items-center gap-10 font-medium">
							<a
								href="#apply"
								className="text-gray-700 hover:text-blue-600 transition-colors"
							>
								Apply Visa
							</a>

							<a
								href="#checklist"
								className="text-gray-700 hover:text-blue-600 transition-colors"
							>
								Visa Checklist
							</a>
							<a
								href="#how-it-works"
								className="text-gray-700 hover:text-blue-600 transition-colors"
							>
								How It Works
							</a>
						</div>
					)}

					{/* RIGHT - Contact + Login */}
					<div className="hidden lg:flex items-center gap-8">
						{/* Contact */}
						<div className="flex items-center gap-6 text-sm text-gray-600">
							<a
								href="tel:+918850189216"
								className="flex items-center gap-2 hover:text-gray-900 transition-colors"
							>
								<Phone className="w-4 h-4" />
								<span>+91 88501 89216</span>
							</a>

							<a
								href="mailto:visa@stamp2fly.com"
								className="flex items-center gap-2 hover:text-gray-900 transition-colors"
							>
								<Mail className="w-4 h-4" />
								<span>visa@stamp2fly.com</span>
							</a>
						</div>

						{/* Login */}
						<Button
							asChild
							className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
						>
							<Link to="/contact">Contact us</Link>
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}

export default Header;
