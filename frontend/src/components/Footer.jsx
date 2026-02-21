import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
	const footerVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.8, ease: "easeOut" },
		},
	};

	return (
		<motion.footer
			variants={footerVariants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true }}
			className="bg-slate-900 text-white"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
					<div className="col-span-2 lg:col-span-1">
						<Link to="/" className="flex items-center space-x-2">
							<div className="inline-block w-6 h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
								<span className="text-white font-bold text-xl">S</span>
							</div>
							<span className="text-xl font-bold">Stamp2Fly</span>
						</Link>
						<p className="mt-4 text-slate-400 text-sm">
							Simplifying your global travel dreams, one visa at a time.
						</p>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">
							Company
						</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<Link
									to="/about"
									className="text-slate-400 hover:text-white transition-colors"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									to="/contact"
									className="text-slate-400 hover:text-white transition-colors"
								>
									Contact
								</Link>
							</li>
							<li>
								<Link
									to="/faq"
									className="text-slate-400 hover:text-white transition-colors"
								>
									FAQ
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">
							Services
						</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<Link
									to="/"
									className="text-slate-400 hover:text-white transition-colors"
								>
									Visa Application
								</Link>
							</li>
							<li>
								<Link
									to="/consultation"
									className="text-slate-400 hover:text-white transition-colors"
								>
									Free Consultation
								</Link>
							</li>
							<li>
								<Link
									to="/"
									className="text-slate-400 hover:text-white transition-colors"
								>
									Document Check
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">
							Legal
						</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<Link
									to="/privacy"
									className="text-slate-400 hover:text-white transition-colors"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									to="/terms"
									className="text-slate-400 hover:text-white transition-colors"
								>
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">
							Admin
						</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<Link
									to="/admin"
									className="text-slate-400 hover:text-white transition-colors"
								>
									Admin Login
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} Stamp2Fly. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-slate-500 hover:text-white transition-colors"><Facebook size={20} /></a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors"><Linkedin size={20} /></a>
          </div>
        </div> */}
				<div className="mt-10 border-t border-slate-800 pt-4 text-center">
					{/* Social Icons */}
					<div className="flex justify-center space-x-4 mb-6">
						<a
							href="https://www.facebook.com/share/188HgRRdw6/"
							className="text-slate-500 hover:text-blue-400 transition-all duration-300 hover:scale-110"
						>
							<Facebook size={20} />
						</a>
						<a
							href="https://twitter.com/Stamp2fly"
							className="text-slate-500 hover:text-blue-400 transition-all duration-300 hover:scale-110"
						>
							<Twitter size={20} />
						</a>
						<a
							href="https://www.instagram.com/stamp2flyvisa.in/"
							className="text-slate-500 hover:text-blue-400 transition-all duration-300 hover:scale-110"
						>
							<Instagram size={20} />
						</a>
						<a
							href="https://www.linkedin.com/company/stamp2fly"
							className="text-slate-500 hover:text-blue-400 transition-all duration-300 hover:scale-110"
						>
							<Linkedin size={20} />
						</a>
					</div>

					{/* Copyright Centered */}
					<p className="text-sm text-slate-400">
						© {new Date().getFullYear()} Stamp2Fly. All rights reserved.
					</p>
				</div>
			</div>
		</motion.footer>
	);
};

export default Footer;
