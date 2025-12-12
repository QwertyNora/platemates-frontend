"use client";

import { useState, useRef, useEffect } from 'react';
import { useAddRestaurantManually } from '@/lib/hooks/useAddRestaurant';
import { useAuth } from '@clerk/nextjs';
import type { AddRestaurantManuallyDto } from '@/types/models';

interface ManualRestaurantFormProps {
  onSuccess: () => void;
}

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
    googleMapsLoaded?: boolean;
  }
}

export function ManualRestaurantForm({ onSuccess }: ManualRestaurantFormProps) {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState<AddRestaurantManuallyDto>({
    name: '',
    address: '',
    cuisineType: '',
    notes: '',
    latitude: undefined,
    longitude: undefined,
  });

  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isGoogleMapsReady, setIsGoogleMapsReady] = useState(false);

  const addMutation = useAddRestaurantManually();

  // Load Google Maps script
  useEffect(() => {
    // Check if already fully loaded
    if (window.google?.maps?.places?.Autocomplete) {
      setIsGoogleMapsReady(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Script exists but not loaded yet, wait for it
      const checkLoaded = setInterval(() => {
        if (window.google?.maps?.places?.Autocomplete) {
          setIsGoogleMapsReady(true);
          clearInterval(checkLoaded);
        }
      }, 100);

      return () => clearInterval(checkLoaded);
    }

    // Load script for the first time
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Wait a bit for places library to be ready
      const checkLoaded = setInterval(() => {
        if (window.google?.maps?.places?.Autocomplete) {
          setIsGoogleMapsReady(true);
          clearInterval(checkLoaded);
        }
      }, 100);
    };
    script.onerror = () => {
      console.error('Failed to load Google Maps script');
    };
    document.head.appendChild(script);
  }, []);

  // Initialize autocomplete when Google Maps is ready
  useEffect(() => {
    if (!isGoogleMapsReady || !addressInputRef.current) return;
    if (autocompleteRef.current) return; // Already initialized

    try {
      // Initialize autocomplete
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        addressInputRef.current,
        {
          types: ['address'],
          componentRestrictions: { country: 'se' },
        }
      );

      // Listen for place selection
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();

        if (place.formatted_address) {
          // Get coordinates from place geometry
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();

          setFormData(prev => ({
            ...prev,
            address: place.formatted_address,
            latitude: lat,
            longitude: lng,
          }));

          console.log('Place selected with coordinates:', { lat, lng });
        }
      });
    } catch (error) {
      console.error('Error initializing autocomplete:', error);
    }
  }, [isGoogleMapsReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addMutation.mutateAsync(formData);
      
      // Success! Reset form and close
      setFormData({
        name: '',
        address: '',
        cuisineType: '',
        notes: '',
        latitude: undefined,
        longitude: undefined,
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to add restaurant:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
      <div className="space-y-6">
        {/* Restaurant Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
            Restaurant Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Oaxen Krog"
            required
            maxLength={256}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Address with Google Autocomplete */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-2">
            Address *
          </label>
          <input
            ref={addressInputRef}
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder={isGoogleMapsReady ? "Start typing an address..." : "Loading address autocomplete..."}
            required
            maxLength={512}
            disabled={!isGoogleMapsReady}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-wait"
          />
          <p className="text-xs text-gray-500 mt-1">
            {isGoogleMapsReady 
              ? "💡 Start typing and select from suggestions for best results"
              : "⏳ Loading address autocomplete..."
            }
          </p>
        </div>

        {/* Cuisine Type */}
        <div>
          <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-900 mb-2">
            Cuisine Type
          </label>
          <input
            type="text"
            id="cuisineType"
            name="cuisineType"
            value={formData.cuisineType}
            onChange={handleChange}
            placeholder="e.g., Nordic, Italian, Japanese"
            maxLength={128}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Why do you want to go here?"
            rows={4}
            maxLength={1000}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={addMutation.isPending || !formData.name || !formData.address}
          className="w-full px-6 py-3 bg-orange-500 text-white text-base font-semibold rounded-xl hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {addMutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
              Adding...
            </span>
          ) : (
            '➕ Add to Want-to-Go List'
          )}
        </button>

        {addMutation.isError && (
          <p className="mt-3 text-sm text-red-600 text-center">
            Failed to add restaurant. Please try again.
          </p>
        )}
      </div>
    </form>
  );
}