"use client";

import { useState } from 'react';
import { SearchRestaurantForm } from '@/components/features/forms/SearchRestaurantForm';
import { ManualRestaurantForm } from '@/components/features/forms/ManualRestaurantForm';

interface AddRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'search' | 'manual';

export function AddRestaurantModal({ isOpen, onClose }: AddRestaurantModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('search');

  const handleSuccess = () => {
    onClose();
    // Reset to search tab for next time
    setTimeout(() => setActiveTab('search'), 300);
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
        <div className="flex items-center gap-2 px-6 py-4 border-b bg-gray-50">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'search'
                ? 'bg-white text-gray-900 shadow-sm border'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            type="button"
          >
            🔍 Search
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'manual'
                ? 'bg-white text-gray-900 shadow-sm border'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            type="button"
          >
            ➕ Add Manually
          </button>
        </div>

        {/* Form Content */}
        {activeTab === 'search' ? (
          <SearchRestaurantForm onSuccess={handleSuccess} />
        ) : (
          <ManualRestaurantForm onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
}