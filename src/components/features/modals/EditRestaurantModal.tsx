"use client";

import { useState, useEffect } from 'react';
import { useUpdateRestaurant } from '@/lib/hooks/useRestaurantMutations';
import type { UserRestaurant, UpdateRestaurantDto } from '@/types/models';

interface EditRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRestaurant: UserRestaurant;
}

export function EditRestaurantModal({ 
  isOpen, 
  onClose, 
  userRestaurant 
}: EditRestaurantModalProps) {
  const [formData, setFormData] = useState<UpdateRestaurantDto>({
    name: userRestaurant.restaurant.name,
    address: userRestaurant.restaurant.address,
    cuisineType: userRestaurant.restaurant.cuisineType || '',
    notes: userRestaurant.notes || '',
  });

  const updateMutation = useUpdateRestaurant();

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: userRestaurant.restaurant.name,
        address: userRestaurant.restaurant.address,
        cuisineType: userRestaurant.restaurant.cuisineType || '',
        notes: userRestaurant.notes || '',
      });
    }
  }, [isOpen, userRestaurant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only send fields that changed
    const dto: UpdateRestaurantDto = {};
    
    if (formData.name !== userRestaurant.restaurant.name) {
      dto.name = formData.name;
    }
    if (formData.address !== userRestaurant.restaurant.address) {
      dto.address = formData.address;
    }
    if (formData.cuisineType !== (userRestaurant.restaurant.cuisineType || '')) {
      dto.cuisineType = formData.cuisineType || undefined;
    }
    if (formData.notes !== (userRestaurant.notes || '')) {
      dto.notes = formData.notes || undefined;
    }

    // If nothing changed, just close
    if (Object.keys(dto).length === 0) {
      onClose();
      return;
    }

    try {
      await updateMutation.mutateAsync({
        userRestaurantId: userRestaurant.id,
        dto,
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to update restaurant:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Edit Restaurant</h2>
          <button
            onClick={onClose}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Restaurant Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                Restaurant Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={256}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-2">
                Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                maxLength={512}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Cuisine Type */}
            <div>
              <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-900 mb-2">
                Cuisine Type
              </label>
              <input
                type="text"
                id="cuisineType"
                name="cuisineType"
                value={formData.cuisineType}
                onChange={handleChange}
                maxLength={128}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Why do you want to go here?"
                rows={4}
                maxLength={1000}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={updateMutation.isPending || !formData.name || !formData.address}
              className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {updateMutation.isError && (
            <p className="text-sm text-red-600 text-center mt-3">
              Failed to update restaurant. Please try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}