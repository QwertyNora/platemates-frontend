"use client";

import { useState } from 'react';
import { useMyRestaurants } from '@/lib/hooks/useMyRestaurants';
import { RestaurantCard } from '@/components/features/restaurants/RestaurantCard';
import { AddRestaurantModal } from '@/components/features/modals/AddRestaurantModal';
import { RestaurantMap } from '@/components/features/map/RestaurantMap';
import type { FilterType } from '@/types/models';

export default function FeedPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const { data: restaurants, isLoading, error } = useMyRestaurants(filter);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Get counts for filter buttons
  const allRestaurants = useMyRestaurants('all').data;
  const totalCount = allRestaurants?.length || 0;
  const wantToGoCount = allRestaurants?.filter(r => r.status === 'WantToGo').length || 0;
  const beenToCount = allRestaurants?.filter(r => r.status === 'BeenTo').length || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-orange-500 mx-auto mb-4"
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
          <p className="text-gray-600">Loading your restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load restaurants</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">My Restaurants</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition font-semibold flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Add Restaurant
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setFilter('want-to-go')}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                filter === 'want-to-go'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎯 Want to Go ({wantToGoCount})
            </button>
            <button
              onClick={() => setFilter('been-to')}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                filter === 'been-to'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✅ Been To ({beenToCount})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Map + List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {restaurants && restaurants.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Map Section - Top on mobile, Left on desktop */}
            <div className="w-full lg:w-1/2 h-[400px] lg:h-[calc(100vh-220px)] lg:sticky lg:top-[180px]">
              <RestaurantMap restaurants={restaurants} />
            </div>

            {/* List Section - Bottom on mobile, Right on desktop */}
            <div className="w-full lg:w-1/2">
              <div className="space-y-4">
                {restaurants.map((userRestaurant) => (
                  <RestaurantCard
                    key={userRestaurant.id}
                    userRestaurant={userRestaurant}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Empty State
          <div className="text-center py-12">
            <div className="mb-4 text-6xl">🍽️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'all' && 'No restaurants yet'}
              {filter === 'want-to-go' && 'No restaurants in Want to Go'}
              {filter === 'been-to' && 'No restaurants in Been To'}
            </h2>
            <p className="text-gray-600 mb-6">
              {filter === 'all' && 'Start building your restaurant list!'}
              {filter === 'want-to-go' && 'Add restaurants you want to try'}
              {filter === 'been-to' && 'Mark restaurants as "Been To" to see them here'}
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition font-semibold"
            >
              Add Your First Restaurant
            </button>
          </div>
        )}
      </div>

      {/* Add Restaurant Modal */}
      <AddRestaurantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}