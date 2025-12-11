// components/RestaurantCard.tsx
'use client'

import { MapPin, Star, MoreVertical } from 'lucide-react'
import Image from 'next/image'
import { UserRestaurant } from '@/lib/api/restaurants'

interface RestaurantCardProps {
  userRestaurant: UserRestaurant
  onMarkAsBeenTo?: () => void
  onRemove?: () => void
}

export function RestaurantCard({ userRestaurant, onMarkAsBeenTo, onRemove }: RestaurantCardProps) {
  const { restaurant, status, review, createdAt } = userRestaurant

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">
      {/* Image */}
      <div className="relative h-48 w-full">
        {restaurant.photoUrl ? (
          <Image
            src={restaurant.photoUrl}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200" />
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
              status === 'WantToGo'
                ? 'bg-teal-500 text-white'
                : 'bg-orange-500 text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white" />
            {status === 'WantToGo' ? 'Want to go' : "I've been!"}
          </span>
        </div>

        {/* More Menu */}
        <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition">
          <MoreVertical className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-1">
          {restaurant.name}
        </h3>
        
        {/* Restaurant Type/Category - you might want to add this to your backend */}
        <p className="text-sm text-gray-600 mb-3">
          {/* Placeholder - add category field to backend */}
          Nordic Fine Dining
        </p>

        <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-1">{restaurant.address}</span>
        </div>

        {/* Review (if Been To) */}
        {review && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {'kr'.repeat(review.priceRange)}
              </span>
            </div>
            {review.notes && (
              <p className="text-sm text-gray-700 italic line-clamp-2">
                "{review.notes}"
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Added {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          
          {status === 'WantToGo' && onMarkAsBeenTo && (
            <button
              onClick={onMarkAsBeenTo}
              className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-full hover:bg-orange-600 transition"
            >
              I've been!
            </button>
          )}
        </div>
      </div>
    </div>
  )
}