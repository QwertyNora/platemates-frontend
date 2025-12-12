"use client";

import { useEffect, useRef, useState } from 'react';
import type { UserRestaurant } from '@/types/models';

interface RestaurantMapProps {
  restaurants: UserRestaurant[];
  onMarkerClick?: (restaurant: UserRestaurant) => void;
}

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
    markerClusterer?: any; // Add this for clustering library
  }
}

export function RestaurantMap({ restaurants, onMarkerClick }: RestaurantMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const markerClustererRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Load Google Maps script (reuse existing if available)
  useEffect(() => {
    if (window.google?.maps?.Map) {
      setIsMapReady(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      const checkLoaded = setInterval(() => {
        if (window.google?.maps?.Map) {
          setIsMapReady(true);
          clearInterval(checkLoaded);
        }
      }, 100);
      return () => clearInterval(checkLoaded);
    }

    // Load script if not exists
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places,marker&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const checkLoaded = setInterval(() => {
        if (window.google?.maps?.Map) {
          setIsMapReady(true);
          clearInterval(checkLoaded);
        }
      }, 100);
    };
    document.head.appendChild(script);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isMapReady || !mapRef.current || googleMapRef.current) return;

    // Center on Stockholm by default
    const center = { lat: 59.3293, lng: 18.0686 };

    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: center,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }], // Hide other POIs
        },
      ],
    });
  }, [isMapReady]);

  // Update markers when restaurants change
  useEffect(() => {
    if (!isMapReady || !googleMapRef.current || !window.google?.maps) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Clear existing clusterer
    if (markerClustererRef.current) {
      markerClustererRef.current.clearMarkers();
    }

    // Filter restaurants with coordinates
    const restaurantsWithCoords = restaurants.filter(
      r => r.restaurant.latitude && r.restaurant.longitude
    );

    if (restaurantsWithCoords.length === 0) return;

    // Create markers
    const newMarkers = restaurantsWithCoords.map(userRestaurant => {
      const { restaurant, status } = userRestaurant;
      const position = {
        lat: restaurant.latitude!,
        lng: restaurant.longitude!,
      };

      // Custom marker colors based on status
      const markerColor = status === 'WantToGo' ? '#06b6d4' : '#f97316'; // cyan-500 : orange-500
      
      // Create SVG marker icon
      const svgMarker = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
        fillColor: markerColor,
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#ffffff',
        rotation: 0,
        scale: 1.5,
        anchor: new window.google.maps.Point(12, 22),
      };

      const marker = new window.google.maps.Marker({
        position,
        map: googleMapRef.current,
        icon: svgMarker,
        title: restaurant.name,
        animation: window.google.maps.Animation.DROP,
      });

      // Add click listener
      marker.addListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(userRestaurant);
        }

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">
                ${restaurant.name}
              </h3>
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">
                ${restaurant.address}
              </p>
              ${restaurant.cuisineType ? `
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #9ca3af;">
                  🍽️ ${restaurant.cuisineType}
                </p>
              ` : ''}
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                <span style="font-size: 12px; font-weight: 600; color: ${status === 'WantToGo' ? '#06b6d4' : '#f97316'};">
                  ${status === 'WantToGo' ? '🎯 Want to Go' : '✅ Been To'}
                </span>
              </div>
            </div>
          `,
        });

        infoWindow.open(googleMapRef.current, marker);
      });

      return marker;
    });

    markersRef.current = newMarkers;

    // Add marker clustering if we have the library (optional for now)
    // We'll add this library later if needed
    // if (window.markerClusterer?.MarkerClusterer && newMarkers.length > 0) {
    //   markerClustererRef.current = new window.markerClusterer.MarkerClusterer({
    //     map: googleMapRef.current,
    //     markers: newMarkers,
    //   });
    // }

    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      if (newMarkers.length === 1) {
        // For single marker, set center and zoom directly
        googleMapRef.current.setCenter(newMarkers[0].getPosition());
        googleMapRef.current.setZoom(14);
      } else {
        // For multiple markers, fit bounds
        const bounds = new window.google.maps.LatLngBounds();
        newMarkers.forEach(marker => bounds.extend(marker.getPosition()));
        googleMapRef.current.fitBounds(bounds);
      }
    }
  }, [restaurants, isMapReady]);

  return (
    <div className="relative w-full h-full">
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl">
          <div className="text-center">
            <svg
              className="animate-spin h-8 w-8 text-orange-500 mx-auto mb-2"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full rounded-2xl" />
    </div>
  );
}