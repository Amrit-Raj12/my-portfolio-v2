"use client";

import React, { useEffect, useState } from 'react';

interface GlobalUplinkProps {
    className?: string;
    defaultLocation?: string;
    defaultCoordinates?: { lat: number; lng: number };
}

const GlobalUplink: React.FC<GlobalUplinkProps> = ({ 
    className = "",
    defaultLocation = "India",
    defaultCoordinates = { lat: 23.356886, lng: 85.350577 }
}) => {
    const [coordinates, setCoordinates] = useState(defaultCoordinates);
    const [location, setLocation] = useState(defaultLocation);

    useEffect(() => {
        // Use provided default location/coordinates instead of overriding with browser geolocation
        // so it consistently represents the author's contact data from contact.json
        setCoordinates(defaultCoordinates);
        setLocation(defaultLocation);
    }, [defaultCoordinates, defaultLocation]);

    const mapHtml = `
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        body { margin: 0; padding: 0; background: #000; overflow: hidden; }
        #map { width: 100vw; height: 100vh; background: #000; }
        /* Hide all leaflet controls to keep it clean */
        .leaflet-control-container { display: none !important; }
        
        /* Cyberpunk styling for default OSM tiles */
        .leaflet-layer {
            filter: invert(100%) sepia(100%) hue-rotate(15deg) saturate(1000%) brightness(80%) contrast(1.2);
        }
        
        /* Custom static marker */
        .cyber-marker {
            background-color: #FACC15;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            box-shadow: 0 0 8px #FACC15;
            border: 1px solid #000;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        var map = L.map('map', { 
            zoomControl: false, 
            attributionControl: false 
        }).setView([${coordinates.lat}, ${coordinates.lng}], 4);
        
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(map);
        
        var icon = L.divIcon({
            className: 'custom-icon',
            html: '<div class="cyber-marker"></div>',
            iconSize: [10, 10],
            iconAnchor: [5, 5]
        });
        
        L.marker([${coordinates.lat}, ${coordinates.lng}], {icon: icon}).addTo(map);
    </script>
</body>
</html>
    `;

    return (
        <div className={`h-64 border border-yellow-400/20 bg-black/40 relative overflow-hidden ${className}`}>
            {/* Map Background */}
            <div className="absolute inset-0 z-0">
                <iframe
                    title="Interactive Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    srcDoc={mapHtml}
                    style={{ border: 0 }}
                    sandbox="allow-scripts allow-same-origin"
                >
                </iframe>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-2 left-2 w-12 h-12 border-l-2 border-t-2 border-yellow-400/40 z-10 pointer-events-none"></div>
            <div className="absolute top-2 right-2 w-12 h-12 border-r-2 border-t-2 border-yellow-400/40 z-10 pointer-events-none"></div>
            <div className="absolute bottom-2 left-2 w-12 h-12 border-l-2 border-b-2 border-yellow-400/40 z-10 pointer-events-none"></div>
            <div className="absolute bottom-2 right-2 w-12 h-12 border-r-2 border-b-2 border-yellow-400/40 z-10 pointer-events-none"></div>

            {/* Bottom status text - LEFT */}
            <div className="absolute top-4 left-4 sm:bottom-4 sm:top-auto sm:left-4 z-10 pointer-events-none bg-black/70 p-2 sm:p-3 border border-[#FACC15]/30 backdrop-blur-sm">
                <div className="text-[#FACC15] text-[10px] sm:text-xs font-mono tracking-wider mb-1 flex items-center gap-2">
                    GLOBAL UPLINK ESTABLISHED
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FACC15]"></span>
                </div>
                <div className="text-[#FACC15]/60 text-[8px] sm:text-[10px] font-mono">
                    COORD: {coordinates.lat.toFixed(6)}° N, {Math.abs(coordinates.lng).toFixed(6)}° {coordinates.lng >= 0 ? 'E' : 'W'}
                </div>
            </div>

            {/* Location info - RIGHT */}
            <div className="absolute bottom-4 right-4 z-10 pointer-events-none flex flex-col items-start bg-black/70 p-3 sm:p-4 border border-[#FACC15]/30 backdrop-blur-sm">
                <div className="text-[#FACC15]/70 text-[10px] font-mono tracking-wider mb-1">
                    LOCATION
                </div>
                <div className="text-[#FACC15] text-sm sm:text-base font-bold font-mono tracking-wide flex items-center gap-2">
                    {location}
                    <svg width="14" height="18" viewBox="0 0 16 20">
                        <path
                            d="M 8 2 Q 5 2 5 5 Q 5 8 8 14 Q 11 8 11 5 Q 11 2 8 2 Z"
                            fill="#FACC15"
                        />
                        <circle cx="8" cy="5" r="1.5" fill="#000000" />
                    </svg>
                </div>

                <div className="w-full h-px bg-[#FACC15]/30 my-2"></div>

                <div className="text-[#FACC15]/80 text-[10px] sm:text-xs font-mono">
                    {coordinates.lat.toFixed(6)}° N
                </div>
                <div className="text-[#FACC15]/80 text-[10px] sm:text-xs font-mono">
                    {Math.abs(coordinates.lng).toFixed(6)}° {coordinates.lng >= 0 ? 'E' : 'W'}
                </div>
            </div>
        </div>
    );
};

export default GlobalUplink;