"use client";

import { useState } from 'react';
import type { UserRestaurant } from '@/types/models';
import { AddReviewModal } from '@/components/features/modals/AddReviewModal';
import { ConfirmDeleteReviewModal } from '@/components/features/modals/ConfirmDeleteReviewModal';
import { EditRestaurantModal } from '@/components/features/modals/EditRestaurantModal';
import { ConfirmDeleteRestaurantModal } from '@/components/features/modals/ConfirmDeleteRestaurantModal';
import { RestaurantCardDropdown } from './RestaurantCardDropdown';
import { MapPin, Utensils, Star, CheckCircle2, Target, DollarSign } from 'lucide-react';

interface RestaurantCardProps {
  userRestaurant: UserRestaurant;
}

export function RestaurantCard({ userRestaurant }: RestaurantCardProps) {
  const { restaurant, status, notes, createdAt, review } = userRestaurant;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isConfirmDeleteReviewOpen, setIsConfirmDeleteReviewOpen] = useState(false);
  const [isConfirmDeleteRestaurantOpen, setIsConfirmDeleteRestaurantOpen] = useState(false);

  const isBeenTo = status === 'BeenTo';

  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Remove country from address (last word after final comma)
  const formattedAddress = restaurant.address.replace(/,\s*\w+\s*$/, '');

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-orange-200 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {restaurant.name}
            </h3>
            
            {/* Address - Below title */}
            <div className="flex items-start gap-1.5 mb-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-600">
                {formattedAddress}
              </p>
            </div>

            {/* Cuisine Type */}
            {restaurant.cuisineType && (
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                <Utensils className="w-3.5 h-3.5" />
                {restaurant.cuisineType}
              </div>
            )}
          </div>

          {/* Status Badge on the right */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap ${
              isBeenTo
                ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                : 'bg-orange-50 text-orange-700 border border-orange-200'
            }`}
          >
            {isBeenTo ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                Been To
              </>
            ) : (
              <>
                <Target className="w-3 h-3" />
                Want to Go
              </>
            )}
          </span>
        </div>

        {/* Content - Different for BeenTo vs WantToGo */}
        {isBeenTo && review ? (
          // Been To - Show Review
          <div className="mb-4 mt-4 pt-4 border-t border-slate-100">
            {/* Rating & Price */}
            <div className="flex items-center gap-6 mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'fill-orange-400 text-orange-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                {[...Array(review.priceRange)].map((_, i) => (
                  <DollarSign key={i} className="w-3.5 h-3.5" />
                ))}
              </div>
            </div>
            
            {/* Review Notes */}
            {review.notes && (
              <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-orange-200 pl-3">
                {review.notes}
              </p>
            )}
          </div>
        ) : (
          // Want to Go - Show Notes
          notes && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-orange-200 pl-3">
                {notes}
              </p>
            </div>
          )
        )}

        {/* Footer with Action Buttons */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">Added {formattedDate}</span>

          <div className="flex items-center gap-2">
            {/* Action Button - Toggle Status */}
            {isBeenTo ? (
              <button
                onClick={() => setIsConfirmDeleteReviewOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-orange-200 hover:border-orange-300
                cursor-pointer"
                title="Mark as Want to Go"
              >
                <Target className="w-3.5 h-3.5" />
                Move to Want to Go
              </button>
            ) : (
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors border border-cyan-200 hover:border-cyan-300
                cursor-pointer"
                title="Mark as Been To"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Move to Been To
              </button>
            )}

            {/* Dropdown Menu */}
            <RestaurantCardDropdown
              onEdit={() => setIsEditModalOpen(true)}
              onDelete={() => setIsConfirmDeleteRestaurantOpen(true)}
            />
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
        isOpen={isConfirmDeleteReviewOpen}
        onClose={() => setIsConfirmDeleteReviewOpen(false)}
        userRestaurantId={userRestaurant.id}
        restaurantName={restaurant.name}
      />

      <ConfirmDeleteRestaurantModal
        isOpen={isConfirmDeleteRestaurantOpen}
        onClose={() => setIsConfirmDeleteRestaurantOpen(false)}
        userRestaurantId={userRestaurant.id}
        restaurantName={restaurant.name}
      />
    </>
  );
}