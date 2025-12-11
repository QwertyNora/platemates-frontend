"use client";

import { useState } from 'react';
import { useMarkAsBeenTo } from '@/lib/hooks/useRestaurantMutations';
import type { AddReviewDto } from '@/types/models';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRestaurantId: string;
  restaurantName: string;
}

export function AddReviewModal({ 
  isOpen, 
  onClose, 
  userRestaurantId,
  restaurantName 
}: AddReviewModalProps) {
  const [formData, setFormData] = useState<AddReviewDto>({
    rating: 3,
    priceRange: 2,
    notes: '',
  });

  const markAsBeenToMutation = useMarkAsBeenTo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await markAsBeenToMutation.mutateAsync({
        userRestaurantId,
        reviewDto: formData,
      });
      
      onClose();
      setFormData({ rating: 3, priceRange: 2, notes: '' });
    } catch (error) {
      console.error('Failed to add review:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl mx-4">
        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Add Review</h2>
          <p className="text-sm text-gray-600 mt-1">{restaurantName}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Rating *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="text-3xl transition-transform hover:scale-110"
                >
                  {star <= formData.rating ? '⭐' : '☆'}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Price Range *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((price) => (
                <button
                  key={price}
                  type="button"
                  onClick={() => setFormData({ ...formData, priceRange: price })}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    price <= formData.priceRange
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {'€'.repeat(price)}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="review-notes" className="block text-sm font-medium text-gray-900 mb-2">
              Your Experience
            </label>
            <textarea
              id="review-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="How was your experience?"
              rows={4}
              maxLength={1000}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={markAsBeenToMutation.isPending}
              className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {markAsBeenToMutation.isPending ? 'Saving...' : 'Mark as Been To'}
            </button>
          </div>

          {markAsBeenToMutation.isError && (
            <p className="text-sm text-red-600 text-center">
              Failed to add review. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}