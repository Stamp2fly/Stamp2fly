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

  const [destination, setDestination] = useState(null);

  const [destinationSearchTerm, setDestinationSearchTerm] = useState('');

  const [isDestinationDropdownOpen, setIsDestinationDropdownOpen] = useState(false);

  const destinationDropdownRef = useRef(null);

  const allDestinations = Object.keys(visaData).map(countryName => ({
    name: countryName,
    flag: visaData[countryName].flag
  }));

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
    navigate('/pricing', {
      state: {
        destination: destination.name,
        nationality: 'India',
      },
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
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
    <div className="w-full px-4 sm:px-0">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 
        rounded-2xl sm:rounded-full 
        p-4 sm:p-2 
        shadow-lg 
        flex flex-col sm:flex-row 
        gap-3 sm:gap-0 sm:items-center sm:space-x-2"
        >

          {/* Source Country (fixed) */}
          <div className="relative flex-1 w-full">
            <div className="flex items-center w-full px-4 py-3 sm:py-2 rounded-xl sm:rounded-full bg-gray-50">
              <MapPin className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1 text-left">
                <p className="text-xs text-gray-500">I'm from</p>
                <p className="font-semibold text-sm text-gray-800 truncate">
                  🇮🇳 India
                </p>
              </div>
            </div>
          </div>

          {/* Divider Desktop Only */}
          <div className="hidden sm:block w-px h-10 bg-gray-200" />

          {/* Destination */}
          <div className="relative flex-1 w-full" ref={destinationDropdownRef}>
            <button
              onClick={() => setIsDestinationDropdownOpen(!isDestinationDropdownOpen)}
              className="flex items-center w-full px-4 py-3 sm:py-2 rounded-xl sm:rounded-full hover:bg-gray-50 transition"
            >
              <Plane className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1 text-left">
                <p className="text-xs text-gray-500">I'm going to</p>
                <p className="font-semibold text-sm text-gray-800 truncate">
                  {destination
                    ? `${destination.flag} ${destination.name}`
                    : "Select destination"}
                </p>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${isDestinationDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {isDestinationDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
              >
                <div className="p-3">
                  <input
                    type="text"
                    placeholder="Search destination..."
                    value={destinationSearchTerm}
                    onChange={(e) => setDestinationSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {filteredDestinations.map((d) => (
                    <CountrySelectItem
                      key={d.name}
                      country={d}
                      onSelect={(country) => {
                        setDestination(country);
                        setIsDestinationDropdownOpen(false);
                        setDestinationSearchTerm("");
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="w-full sm:w-14 h-12 sm:h-14 
          rounded-xl sm:rounded-full 
          bg-blue-600 hover:bg-blue-700 
          text-white flex items-center justify-center"
          >
            <Search className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default VisaSearch;