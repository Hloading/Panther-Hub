
import React, { useEffect, useRef } from 'react';

const EventMap = ({ latitude, longitude }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        const loadMap = () => {
            const map = new window.google.maps.Map(mapRef.current, {
                center: { lat: latitude, lng: longitude },
                zoom: 15
            });
            new window.google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: map
            });
        };

        if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
            script.async = true;
            script.defer = true;
            script.onload = loadMap;
            document.body.appendChild(script);
        } else {
            loadMap();
        }
    }, [latitude, longitude]);

    return <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div>;
};

export default EventMap;
