"use client";

import { useState, useEffect } from 'react';
import { useUpdateRestaurant } from '@/lib/hooks/useRestaurantMutations';
import type { UserRestaurant, UpdateRestaurantDto } from '@/types/models';
import { X, Loader2 } from 'lucide-react';

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
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-xl mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Edit Restaurant</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="space-y-5">
            {/* Restaurant Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
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
                className="w-full px-4 py-2.5 bg-cream-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow text-slate-900"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1.5">
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
                className="w-full px-4 py-2.5 bg-cream-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow text-slate-900"
              />
            </div>

            {/* Cuisine Type */}
            <div>
              <label htmlFor="cuisineType" className="block text-sm font-medium text-slate-700 mb-1.5">
                Cuisine Type
              </label>
              <input
                type="text"
                id="cuisineType"
                name="cuisineType"
                value={formData.cuisineType}
                onChange={handleChange}
                maxLength={128}
                className="w-full px-4 py-2.5 bg-cream-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow text-slate-900"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1.5">
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
                className="w-full px-4 py-2.5 bg-cream-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow resize-none text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 rounded-b-2xl border-t border-slate-200 bg-cream-50">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="flex-1 px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={updateMutation.isPending || !formData.name || !formData.address}
              className="flex-1 px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
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