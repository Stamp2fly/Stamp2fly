import { useLocation } from "react-router-dom";
import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function Header(props) {
	const navigate = useNavigate();
	const location = useLocation();
	const isHomePage = location.pathname === "/";
	return (
		<header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 lg:px-8">
				<div className="flex items-center justify-between h-16 sm:h-20">

					{/* LEFT - Logo */}
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

					{/* CENTER - Navigation (Desktop only) */}
					{isHomePage && (
						<div className="hidden md:flex items-center gap-8 font-medium">
							<a href="#apply" className="text-gray-700 hover:text-blue-600 transition">
								Apply Visa
							</a>
							<a href="#checklist" className="text-gray-700 hover:text-blue-600 transition">
								Visa Checklist
							</a>
							<a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition">
								How It Works
							</a>
						</div>
					)}

					{/* RIGHT - Contact Button */}
					<div className="flex items-center">

						{/* Desktop Button */}
						<Button
							asChild
							className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6"
						>
							<Link to="/contact">Contact Us</Link>
						</Button>

						{/* Mobile Button */}
						<button
							onClick={() => navigate("/contact")}
							className="md:hidden px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow transition"
						>
							Contact Us
						</button>

					</div>

				</div>
			</div>
		</header>
	);
}

export default Header;
