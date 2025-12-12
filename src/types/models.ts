// Domain models

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  clerkUserId: string;
  email: string;
  username: string;
  createdAt: string;
  location?: string;
  description?: string;
}

// ============================================
// RESTAURANT TYPES
// ============================================

export interface Restaurant {
  id: string;
  googlePlaceId: string | null;
  name: string;
  address: string;
  cuisineType?: string;
  phoneNumber?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

export interface UserRestaurant {
  id: string;
  restaurant: Restaurant;
  status: 'WantToGo' | 'BeenTo';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  review?: RestaurantReview;
}

export interface RestaurantReview {
  id: string;
  rating: number; // 1-5
  priceRange: number; // 1-4
  notes?: string;
  createdAt: string;
}

// ============================================
// GOOGLE PLACES TYPES
// ============================================

export interface GooglePlacePrediction {
  placeId: string;
  name: string;
  address: string;
}

export interface GooglePlacesSearchResult {
  predictions: GooglePlacePrediction[];
}


// ============================================
// INPUT TYPES (for API calls)
// ============================================

export interface AddRestaurantManuallyDto {
  name: string;
  address: string;
  cuisineType?: string;
  notes?: string;
}

export interface AddReviewDto {
  rating: number; // 1-5
  priceRange: number; // 1-4
  notes?: string;
}

export interface UpdateRestaurantDto {
  name?: string;
  address?: string;
  cuisineType?: string;
  notes?: string;
}

// ============================================
// UI TYPES
// ============================================

export type FilterType = 'all' | 'want-to-go' | 'been-to';