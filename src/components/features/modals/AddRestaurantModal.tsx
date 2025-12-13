"use client";

import { useState } from 'react';
import { SearchRestaurantForm } from '@/components/features/forms/SearchRestaurantForm';
import { ManualRestaurantForm } from '@/components/features/forms/ManualRestaurantForm';
import { useAddRestaurantManually } from '@/lib/hooks/useAddRestaurant';
import { getPlaceDetails } from '@/lib/api/restaurantService';
import { useAuth } from '@clerk/nextjs';
import type { GooglePlacePrediction, AddRestaurantManuallyDto } from '@/types/models';

interface AddRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'search' | 'manual';

export function AddRestaurantModal({ isOpen, onClose }: AddRestaurantModalProps) {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('search');
  
  // Search tab state
  const [selectedRestaurant, setSelectedRestaurant] = useState<GooglePlacePrediction | null>(null);
  const [searchNotes, setSearchNotes] = useState('');
  
  // Manual tab state
  const [manualFormData, setManualFormData] = useState<AddRestaurantManuallyDto>({
    name: '',
    address: '',
    cuisineType: '',
    notes: '',
    latitude: undefined,
    longitude: undefined,
  });
  const [isGoogleMapsReady, setIsGoogleMapsReady] = useState(false);
  
  const addMutation = useAddRestaurantManually();

  const handleSuccess = () => {
    // Reset all state
    setSelectedRestaurant(null);
    setSearchNotes('');
    setManualFormData({
      name: '',
      address: '',
      cuisineType: '',
      notes: '',
      latitude: undefined,
      longitude: undefined,
    });
    
    onClose();
    
    // Reset to search tab for next time
    setTimeout(() => setActiveTab('search'), 300);
  };

  const handleCancel = () => {
    onClose();
  };

  const handleAdd = async () => {
    if (activeTab === 'search') {
      // Add from search
      if (!selectedRestaurant) return;

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
        const placeDetails = await getPlaceDetails(selectedRestaurant.placeId, token);

        // Add restaurant with coordinates
        await addMutation.mutateAsync({
          name: placeDetails.name,
          address: placeDetails.address,
          cuisineType: placeDetails.cuisineType || undefined,
          notes: searchNotes || undefined,
          latitude: placeDetails.latitude,
          longitude: placeDetails.longitude,
        });

        handleSuccess();
      } catch (error) {
        console.error('Failed to add restaurant:', error);
      }
    } else {
      // Add manually
      try {
        await addMutation.mutateAsync(manualFormData);
        handleSuccess();
      } catch (error) {
        console.error('Failed to add restaurant:', error);
      }
    }
  };

  // Determine if Add button should be enabled
  const isAddEnabled = activeTab === 'search' 
    ? selectedRestaurant !== null 
    : manualFormData.name.trim() !== '' && manualFormData.address.trim() !== '';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Add Restaurant</h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            type="button"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-6 py-4 border-b bg-gray-50 flex-shrink-0">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'search'
                ? 'bg-white text-gray-900 shadow-sm border'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            type="button"
          >
            🔍 Search
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'manual'
                ? 'bg-white text-gray-900 shadow-sm border'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            type="button"
          >
            ➕ Add Manually
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          {activeTab === 'search' ? (
            <SearchRestaurantForm 
              selectedRestaurant={selectedRestaurant}
              onSelectRestaurant={setSelectedRestaurant}
              notes={searchNotes}
              onNotesChange={setSearchNotes}
            />
          ) : (
            <ManualRestaurantForm 
              formData={manualFormData}
              onFormDataChange={setManualFormData}
              isGoogleMapsReady={isGoogleMapsReady}
              onGoogleMapsReady={setIsGoogleMapsReady}
            />
          )}
        </div>

        {/* Footer with Action Buttons */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition font-semibold"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!isAddEnabled || addMutation.isPending}
              className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
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
          </div>
          
          {/* Error Message */}
          {addMutation.isError && (
            <p className="mt-3 text-sm text-red-600 text-center">
              Failed to add restaurant. Please try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}