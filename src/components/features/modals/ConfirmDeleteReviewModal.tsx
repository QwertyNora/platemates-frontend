"use client";

import { useMarkAsWantToGo } from '@/lib/hooks/useRestaurantMutations';

interface ConfirmDeleteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRestaurantId: string;
  restaurantName: string;
}

export function ConfirmDeleteReviewModal({ 
  isOpen, 
  onClose, 
  userRestaurantId,
  restaurantName 
}: ConfirmDeleteReviewModalProps) {
  const markAsWantToGoMutation = useMarkAsWantToGo();

  const handleConfirm = async () => {
    try {
      await markAsWantToGoMutation.mutateAsync(userRestaurantId);
      onClose();
    } catch (error) {
      console.error('Failed to remove review:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl mx-4 p-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          Remove from "Been To"?
        </h2>
        <p className="text-sm text-gray-600 text-center mb-1">
          <strong>{restaurantName}</strong>
        </p>
        <p className="text-sm text-gray-600 text-center mb-6">
          This will delete your review and move the restaurant back to "Want to Go".
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={markAsWantToGoMutation.isPending}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={markAsWantToGoMutation.isPending}
            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {markAsWantToGoMutation.isPending ? 'Removing...' : 'Yes, Remove Review'}
          </button>
        </div>

        {markAsWantToGoMutation.isError && (
          <p className="text-sm text-red-600 text-center mt-3">
            Failed to remove review. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}