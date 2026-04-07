import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-slate-950 text-white"
    >
      <div className="max-w-6xl mx-auto px-6 py-10 text-center">

        {/* Logo */}
        <Link to="/" className="inline-flex items-center space-x-2 mb-4">
          <div className="w-7 h-7 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-lg font-semibold">Stamp2Fly</span>
        </Link>

        {/* Quick Links */}
        <div className="flex justify-center flex-wrap gap-6 text-sm text-slate-400 mb-6">
          <Link to="/about" className="hover:text-white transition">About</Link>
          <Link to="/contact" className="hover:text-white transition">Contact</Link>
          <Link to="/faq" className="hover:text-white transition">FAQ</Link>
          <Link to="/blogs" className="hover:text-white transition">Blogs</Link>
          {/* <Link to="/admin" className="hover:text-white transition">Admin</Link> */}
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-5 mb-6">
          <a href="https://www.facebook.com/share/188HgRRdw6/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 transition">
            <Facebook size={18} />
          </a>
          <a href="https://www.instagram.com/stamp2fly/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 transition">
            <Instagram size={18} />
          </a>
          <a href="https://www.linkedin.com/company/stamp2fly" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 transition">
            <Linkedin size={18} />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Stamp2Fly. All rights reserved.
        </p>

      </div>
    </motion.footer>
  );
};

export default Footer;