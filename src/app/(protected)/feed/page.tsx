"use client";

import { useCurrentUser } from "@/lib/api/userService";
import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { AddRestaurantModal } from "@/components/features/modals/AddRestaurantModal";
import { RestaurantCard } from "@/components/features/restaurants/RestaurantCard";
import { useMyRestaurants } from "@/lib/hooks/useMyRestaurants";
import { FilterType } from "@/types/models";

export default function FeedPage() {
  const { isSignedIn, userId, getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const { data: user, isLoading, error } = useCurrentUser();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

  // Fetch restaurants
  const { 
    data: restaurants, 
    isLoading: isLoadingRestaurants,
    error: restaurantsError 
  } = useMyRestaurants(filter);

  const allRestaurants = useMyRestaurants('all').data;
  const wantToGoCount = allRestaurants?.filter(r => r.status == 'WantToGo').length || 0;
  const beenToCount = allRestaurants?.filter(r => r.status == 'BeenTo').length || 0;
  const totalCount = (allRestaurants?.length || 0);

  // Log Clerk user info
  useEffect(() => {
    const logUserInfo = async () => {
      console.log("=== CLERK USER INFO ===");
      console.log("isSignedIn:", isSignedIn);
      console.log("userId:", userId);
      console.log("clerkUser:", clerkUser);
      console.log("email:", clerkUser?.emailAddresses[0]?.emailAddress);
      console.log("username:", clerkUser?.username);

      const template = process.env.NODE_ENV === 'production' 
      ? 'platemates-api-production' 
      : 'platemates-api';
      
      const token = await getToken({ template });
      console.log("token:", token);
      console.log("======================");
    };
    
    if (isSignedIn) {
      logUserInfo();
    }
  }, [isSignedIn, userId, clerkUser, getToken]);

  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error loading user</h1>
        <p className="text-red-500 mb-4">{error.message}</p>
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Clerk User Info (from frontend):</h2>
          <p>Clerk User ID: {userId}</p>
          <p>Email: {clerkUser?.emailAddresses[0]?.emailAddress}</p>
          <p>Username: {clerkUser?.username}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Restaurants</h1>
            <p className="text-lg text-gray-600">
              {restaurants?.length || 0} {restaurants?.length === 1 ? 'place' : 'places'} to explore
            </p>
          </div>
          
          {/* Add Restaurant Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition shadow-lg hover:shadow-xl"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Restaurant
          </button>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium transition ${
              filter === 'all'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}>
            All ({totalCount})
          </button>

          <button
            onClick={() => setFilter('want-to-go')}
            className={`px-4 py-2 rounded-xl font-medium transition ${
              filter === 'want-to-go'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}>
            🎯 Want to Go ({wantToGoCount})
          </button>

          <button
            onClick={() => setFilter('been-to')}
            className={`px-4 py-2 rounded-xl font-medium transition ${
              filter === 'been-to'
              ? 'bg-green-500 text-white shadow-sm'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-green-200'
            }`}>
            ✅ Been To ({beenToCount})
          </button>
        </div>

        {/* Restaurant List */}
        <div className="space-y-4">
          {isLoadingRestaurants ? (
            <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-orange-500" viewBox="0 0 24 24">
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
                <span className="text-gray-600">Loading restaurants...</span>
              </div>
            </div>
          ) : restaurantsError ? (
            <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
              <p className="text-red-600">Failed to load restaurants</p>
              <p className="text-sm text-gray-500 mt-2">{restaurantsError.message}</p>
            </div>
          ) : restaurants && restaurants.length > 0 ? (
            restaurants.map((userRestaurant) => (
              <RestaurantCard
                key={userRestaurant.id}
                userRestaurant={userRestaurant}
              />
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
              <div className="max-w-sm mx-auto">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No restaurants yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start building your restaurant wishlist! Click the button above to add your first place.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AddRestaurantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}