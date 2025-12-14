"use client";

import { useState } from 'react';
import { SearchRestaurantForm } from '@/components/features/forms/SearchRestaurantForm';
import { ManualRestaurantForm } from '@/components/features/forms/ManualRestaurantForm';
import { useAddRestaurantManually } from '@/lib/hooks/useAddRestaurant';
import { getPlaceDetails } from '@/lib/api/restaurantService';
import { useAuth } from '@clerk/nextjs';
import type { GooglePlacePrediction, AddRestaurantManuallyDto } from '@/types/models';
import { Plus, Search, X, Loader2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cream-200 shrink-0">
          <h2 className="text-2xl font-semibold text-slate-900">Add Restaurant</h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            type="button"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-cream-200 bg-cream-50 shrink-0">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'search'
                ? 'bg-white text-orange-600 shadow-sm border border-orange-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
            type="button"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'manual'
                ? 'bg-white text-orange-600 shadow-sm border border-orange-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
            type="button"
          >
            <Plus className="w-4 h-4" />
            Add Manually
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 bg-white">
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
        <div className="border-t border-cream-200 p-6 bg-cream-50 shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-white transition-all font-medium"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!isAddEnabled || addMutation.isPending}
              className="flex-1 px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              type="button"
            >
              {addMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add to List
                </span>
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