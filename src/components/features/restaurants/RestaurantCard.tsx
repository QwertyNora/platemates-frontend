"use client";

import { useState } from 'react';
import type { UserRestaurant } from '@/types/models';
import { EditRestaurantModal } from '@/components/features/modals/EditRestaurantModal';
import { AddReviewModal } from '@/components/features/modals/AddReviewModal';
import { ConfirmDeleteReviewModal } from '@/components/features/modals/ConfirmDeleteReviewModal';


interface RestaurantCardProps {
  userRestaurant: UserRestaurant;
}

export function RestaurantCard({ userRestaurant }: RestaurantCardProps) {
  const { restaurant, status, notes, createdAt, review } = userRestaurant;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const isBeenTo = status === 'BeenTo';

  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {restaurant.name}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <svg
                className="w-4 h-4"
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
              {restaurant.address}
            </p>
          </div>

          {/* Status Badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isBeenTo
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700'
            }`}
          >
            {isBeenTo ? '✅ Been To' : '🎯 Want to Go'}
          </span>
        </div>

        {/* Cuisine Type */}
        {restaurant.cuisineType && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1 text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
              🍽️ {restaurant.cuisineType}
            </span>
          </div>
        )}

        {/* Content - Different for BeenTo vs WantToGo */}
        {isBeenTo && review ? (
          // Been To - Show Review
          <div className="mb-3 space-y-2">
            {/* Rating & Price */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-700">Rating:</span>
                <span className="text-lg">{'⭐'.repeat(review.rating)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-700">Price:</span>
                <span className="text-lg text-gray-700">{'€'.repeat(review.priceRange)}</span>
              </div>
            </div>
            
            {/* Review Notes */}
            {review.notes && (
              <p className="text-sm text-gray-700 italic">"{review.notes}"</p>
            )}
          </div>
        ) : (
          // Want to Go - Show Notes
          notes && (
            <div className="mb-3">
              <p className="text-sm text-gray-700 italic">"{notes}"</p>
            </div>
          )
        )}

        {/* Footer with Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">Added {formattedDate}</span>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Edit Button */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
              title="Edit restaurant"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>

            {/* Mark as Been To / Want to Go Button */}
            {isBeenTo ? (
              <button
                onClick={() => setIsConfirmDeleteOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-orange-700 hover:text-orange-800 bg-orange-50 hover:bg-orange-100 rounded-lg transition font-medium"
                title="Mark as Want to Go"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
                Mark as Want to Go
              </button>
            ) : (
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded-lg transition font-medium"
                title="Mark as Been To"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Mark as Been To
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditRestaurantModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userRestaurant={userRestaurant}
      />

      <AddReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        userRestaurantId={userRestaurant.id}
        restaurantName={restaurant.name}
      />

      <ConfirmDeleteReviewModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        userRestaurantId={userRestaurant.id}
        restaurantName={restaurant.name}
      />
    </>
  );
}