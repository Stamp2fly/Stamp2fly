import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center"
              >
                <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/ac7c5e33-833b-415b-87a1-38b5119ebfe9/1e7b9ac90d11a07facf22532137e65d6.png" alt="Stamp2Fly Brandmark" className="h-8 w-auto" />
                <span className="text-xl font-bold text-gray-800">Stamp2Fly</span>
              </motion.div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a href="tel:+918850189216" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <Phone className="w-4 h-4" />
              <span>+918850189216</span>
            </a>
            <a href="mailto:visa@stamp2fly.com" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <Mail className="w-4 h-4" />
              <span>visa@stamp2fly.com</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;