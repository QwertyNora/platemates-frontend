"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchRestaurants } from '@/lib/hooks/useSearchRestaurants';
import { useAddRestaurantManually } from '@/lib/hooks/useAddRestaurant';
import { getPlaceDetails } from '@/lib/api/restaurantService';
import { useAuth } from '@clerk/nextjs';
import type { GooglePlacePrediction } from '@/types/models';

interface SearchRestaurantFormProps {
  onSuccess: () => void;
}

export function SearchRestaurantForm({ onSuccess }: SearchRestaurantFormProps) {
  const { getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState('');
  const { results, isLoading, error, search, clearResults } = useSearchRestaurants();
  const addMutation = useAddRestaurantManually();

  // Memoize search function to prevent infinite loops
  const performSearch = useCallback((query: string) => {
    if (query.trim().length >= 2) {
      search(query);
    }
  }, [search]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  const handleAddRestaurant = async (prediction: GooglePlacePrediction) => {
    try {
      const template = process.env.NODE_ENV === 'production' 
        ? 'platemates-api-production' 
        : 'platemates-api';
      
      const token = await getToken({ template });
      if (!token) {
        console.error('No authentication token');
        return;
      }

      // Fetch full place details to get coordinates
      const placeDetails = await getPlaceDetails(prediction.placeId, token);

      // Add restaurant with coordinates
      await addMutation.mutateAsync({
        name: placeDetails.name,
        address: placeDetails.address,
        cuisineType: placeDetails.cuisineType || undefined,
        notes: notes || undefined,
        latitude: placeDetails.latitude,
        longitude: placeDetails.longitude,
      });

      // Success!
      setSearchQuery('');
      setNotes('');
      clearResults();
      onSuccess();
    } catch (error) {
      console.error('Failed to add restaurant:', error);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="space-y-4">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-900 mb-2">
            Search for a restaurant
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., Coco, Oaxen, Dirty Coco..."
              className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Notes (optional) */}
        <div>
          <label htmlFor="search-notes" className="block text-sm font-medium text-gray-900 mb-2">
            Notes (optional)
          </label>
          <textarea
            id="search-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Why do you want to go here?"
            rows={3}
            maxLength={1000}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-orange-500" viewBox="0 0 24 24">
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
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Search Results */}
        {results && results.predictions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Found {results.predictions.length} restaurant{results.predictions.length !== 1 ? 's' : ''}
            </p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.predictions.map((prediction) => (
                <button
                  key={prediction.placeId}
                  onClick={() => handleAddRestaurant(prediction)}
                  disabled={addMutation.isPending}
                  className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">🍽️</span>
                        <h4 className="font-semibold text-gray-900 truncate">
                          {prediction.name}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="truncate">{prediction.address}</span>
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 group-hover:bg-orange-500 group-hover:text-white transition">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {searchQuery.length >= 2 && !isLoading && results && results.predictions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No restaurants found. Try a different search.</p>
          </div>
        )}

        {/* Add Mutation Error */}
        {addMutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-600">Failed to add restaurant. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}