import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Plane, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useVisa } from '@/contexts/VisaContext';

function VisaSearch() {
  const navigate = useNavigate();
  const { visaData } = useVisa();
  
  const [nationality, setNationality] = useState({ name: 'India', flag: '🇮🇳' });
  const [destination, setDestination] = useState(null);

  const [nationalitySearchTerm, setNationalitySearchTerm] = useState('');
  const [destinationSearchTerm, setDestinationSearchTerm] = useState('');

  const [isNationalityDropdownOpen, setIsNationalityDropdownOpen] = useState(false);
  const [isDestinationDropdownOpen, setIsDestinationDropdownOpen] = useState(false);
  
  const nationalityDropdownRef = useRef(null);
  const destinationDropdownRef = useRef(null);

  const countries = [
    { name: 'India', flag: '🇮🇳' },
    { name: 'United States', flag: '🇺🇸' },
    { name: 'United Kingdom', flag: '🇬🇧' },
    { name: 'Canada', flag: '🇨🇦' },
    { name: 'Australia', flag: '🇦🇺' },
    { name: 'United Arab Emirates', flag: '🇦🇪' },
    { name: 'Singapore', flag: '🇸🇬' },
  ];

  const allDestinations = Object.keys(visaData).map(countryName => ({
    name: countryName,
    flag: visaData[countryName].flag
  }));

  const filteredNationalities = countries.filter(c => c.name.toLowerCase().includes(nationalitySearchTerm.toLowerCase()));
  const filteredDestinations = allDestinations.filter(d => d.name.toLowerCase().includes(destinationSearchTerm.toLowerCase()));

  const handleSearch = () => {
    if (!destination) {
      toast({
        title: "Destination required",
        description: "Please select where you're going.",
        variant: "destructive",
      });
      return;
    }
    const destSlug = destination.name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/visa-requirements/${destSlug}?nationality=${nationality.name}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nationalityDropdownRef.current && !nationalityDropdownRef.current.contains(event.target)) {
        setIsNationalityDropdownOpen(false);
      }
      if (destinationDropdownRef.current && !destinationDropdownRef.current.contains(event.target)) {
        setIsDestinationDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const CountrySelectItem = ({ country, onSelect }) => (
    <button
      onClick={() => onSelect(country)}
      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
    >
      <span className="mr-3 text-lg">{country.flag}</span> {country.name}
    </button>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-full p-2 shadow-lg flex items-center space-x-2">
        <div className="relative flex-1" ref={nationalityDropdownRef}>
          <div className="flex items-center w-full" onClick={() => setIsNationalityDropdownOpen(!isNationalityDropdownOpen)}>
            <MapPin className="h-5 w-5 text-gray-400 mx-4" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">I'm from</p>
              <p className="font-semibold text-gray-800">{nationality.flag} {nationality.name}</p>
            </div>
            <ChevronDown className={`h-5 w-5 text-gray-400 mr-2 transition-transform ${isNationalityDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
          {isNationalityDropdownOpen && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full mt-2 w-64 bg-white rounded-xl shadow-lg border z-10 overflow-hidden">
               <div className="p-2">
                 <input
                  type="text"
                  placeholder="Search country..."
                  value={nationalitySearchTerm}
                  onChange={(e) => setNationalitySearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
               </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredNationalities.map(c => <CountrySelectItem key={c.name} country={c} onSelect={(country) => { setNationality(country); setIsNationalityDropdownOpen(false); setNationalitySearchTerm(''); }} />)}
              </div>
            </motion.div>
          )}
        </div>

        <div className="w-px h-10 bg-gray-200"></div>

        <div className="relative flex-1" ref={destinationDropdownRef}>
          <div className="flex items-center w-full" onClick={() => setIsDestinationDropdownOpen(!isDestinationDropdownOpen)}>
            <Plane className="h-5 w-5 text-gray-400 mx-4" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">I'm going to</p>
              <p className="font-semibold text-gray-800">{destination ? `${destination.flag} ${destination.name}` : 'Select destination'}</p>
            </div>
            <ChevronDown className={`h-5 w-5 text-gray-400 mr-2 transition-transform ${isDestinationDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
          {isDestinationDropdownOpen && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full mt-2 w-64 bg-white rounded-xl shadow-lg border z-10 overflow-hidden">
               <div className="p-2">
                 <input
                  type="text"
                  placeholder="Search destination..."
                  value={destinationSearchTerm}
                  onChange={(e) => setDestinationSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
               </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredDestinations.map(d => <CountrySelectItem key={d.name} country={d} onSelect={(country) => { setDestination(country); setIsDestinationDropdownOpen(false); setDestinationSearchTerm(''); }} />)}
              </div>
            </motion.div>
          )}
        </div>
        
        <Button onClick={handleSearch} className="rounded-full bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 flex-shrink-0">
          <Search className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

export default VisaSearch;