// src/components/EventMap.js

import React, { useEffect, useRef, useState } from 'react';

const EventMap = ({ latitude, longitude }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    const initializeMap = () => {
      if (mapRef.current && window.google) {
        // Initialize the map only once
        if (!mapInstance.current) {
          mapInstance.current = new window.google.maps.Map(mapRef.current, {
            center: { lat: latitude, lng: longitude },
            zoom: 15,
          });

          // Create the marker
          markerInstance.current = new window.google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: mapInstance.current,
          });
        } else {
          // Update the marker position
          markerInstance.current.setPosition({ lat: latitude, lng: longitude });
          // Center the map on the new coordinates
          mapInstance.current.setCenter({ lat: latitude, lng: longitude });
        }

        setIsMapLoaded(true);
      }
    };

    const loadGoogleMapsScript = () => {
      if (!window.google || !window.google.maps) {
        const existingScript = document.getElementById('googleMapsScript');

        if (!existingScript) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
          script.id = 'googleMapsScript';
          script.async = true;
          script.defer = true;
          script.onload = initializeMap;
          script.onerror = () => {
            console.error('Failed to load Google Maps script');
          };
          document.body.appendChild(script);
        } else {
          existingScript.addEventListener('load', initializeMap);
          existingScript.addEventListener('error', () => {
            console.error('Failed to load Google Maps script');
          });
        }
      } else {
        initializeMap();
      }
    };

    loadGoogleMapsScript();

    // Cleanup function
    return () => {
      if (markerInstance.current) {
        markerInstance.current.setMap(null);
        markerInstance.current = null;
      }
      if (mapInstance.current) {
        mapInstance.current = null;
      }
    };
  }, [latitude, longitude]);

  return (
    <div
      ref={mapRef}
      style={{ height: '400px', width: '100%' }}
      aria-label="Event Location Map"
    >
      {!isMapLoaded && <p>Loading map...</p>}
    </div>
  );
};

export default EventMap;
