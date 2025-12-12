"use client";

import { useDeleteRestaurant } from "@/lib/hooks/useDeleteRestaurant";

interface ConfirmDeleteRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRestaurantId: string;
  restaurantName: string;
}

export function ConfirmDeleteRestaurantModal({ 
  isOpen, 
  onClose, 
  userRestaurantId,
  restaurantName 
}: ConfirmDeleteRestaurantModalProps) {
  const deleteMutation = useDeleteRestaurant();

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(userRestaurantId);
      onClose();
    } catch (error) {
      console.error('Failed to delete restaurant:', error);
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
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          Delete Restaurant?
        </h2>
        <p className="text-sm text-gray-600 text-center mb-1">
          <strong>{restaurantName}</strong>
        </p>
        <p className="text-sm text-gray-600 text-center mb-6">
          This will permanently delete this restaurant and any associated reviews from your list.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>

        {deleteMutation.isError && (
          <p className="text-sm text-red-600 text-center mt-3">
            Failed to delete restaurant. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}