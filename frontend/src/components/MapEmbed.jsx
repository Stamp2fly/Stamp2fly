import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet's default marker icon issue in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapEmbed = () => {
  // Latitude and Longitude for Goregaon East
  const position = [19.15506, 72.88767];
  
  // Direct link to open these coordinates in Google Maps
  const googleMapsLink = "https://maps.app.goo.gl/AE2uaHnFWFvUxpTH6";

  return (
    <div className="w-full h-[250px] rounded-xl overflow-hidden shadow-sm border border-gray-100 mt-4 relative">
      
      {/* The Leaflet Map */}
      <MapContainer 
        center={position} 
        zoom={14} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <strong>Stamp2Fly Office</strong><br />
            Royal Palms, Goregaon East.
          </Popup>
        </Marker>
      </MapContainer>

      {/* Your Floating Google Maps Button */}
      <a 
        href={googleMapsLink}
        target="_blank"
        rel="noopener noreferrer"
        // z-[1000] is required to ensure it sits above Leaflet's map controls
        className="absolute bottom-4 right-4 z-[1000] bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-50 transition-colors flex items-center gap-2 text-sm border border-gray-100"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        Open in Google Maps
      </a>
      
    </div>
  );
};

export default MapEmbed;