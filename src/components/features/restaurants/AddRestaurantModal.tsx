"use client";

import { useState } from 'react';
import { useAddRestaurantManually } from '@/lib/hooks/useAddRestaurant';
import type { AddRestaurantManuallyDto } from '@/types/models';

interface AddRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddRestaurantModal({ isOpen, onClose }: AddRestaurantModalProps) {
  const [formData, setFormData] = useState<AddRestaurantManuallyDto>({
    name: '',
    address: '',
    cuisineType: '',
    notes: '',
  });

  const addMutation = useAddRestaurantManually();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addMutation.mutateAsync(formData);
      
      // Success! Close modal and reset form
      onClose();
      setFormData({
        name: '',
        address: '',
        cuisineType: '',
        notes: '',
      });
    } catch (error) {
      console.error('Failed to add restaurant:', error);
      // Error handling - you could add a toast notification here
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
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Add Restaurant</h2>
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

        {/* Tabs */}
        <div className="flex items-center gap-4 px-6 py-4 border-b bg-gray-50">
          <button
            className="px-4 py-2 text-gray-400 rounded-xl text-sm font-medium"
            disabled
            type="button"
          >
            🔍 Search
          </button>
          <button
            className="px-4 py-2 bg-white text-gray-900 rounded-xl text-sm font-medium border shadow-sm"
            type="button"
          >
            ➕ Add Manually
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
                placeholder="e.g., Oaxen Krog"
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
                placeholder="e.g., Beckholmsvägen 26, Stockholm"
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
                placeholder="e.g., Nordic, Italian, Japanese"
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
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={addMutation.isPending || !formData.name || !formData.address}
            className="w-full px-6 py-3 bg-orange-500 text-white text-base font-semibold rounded-xl hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                Adding...
              </span>
            ) : (
              '➕ Add to Want-to-Go List'
            )}
          </button>

          {addMutation.isError && (
            <p className="mt-3 text-sm text-red-600 text-center">
              Failed to add restaurant. Please try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}