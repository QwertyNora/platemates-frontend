// types/models.ts

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: number // Backend uses int, not string
  clerkUserId: string
  email: string
  username: string // Backend uses username, not name
  createdAt: string // ISO string from API
  location?: string
  description?: string
  followersCount: number
  followingCount: number
}

export interface UpdateUserDto {
  username?: string
  location?: string
  description?: string
}

// ============================================
// RESTAURANT TYPES (Backend Response)
// ============================================

export interface Restaurant {
  id: number // Backend uses int
  googlePlaceId: string
  name: string
  address: string
  phoneNumber?: string
  website?: string
  latitude?: number // Backend uses latitude/longitude, not lat/lng
  longitude?: number
  googleRating?: number
  googlePriceLevel?: number // 1-4 from Google
  googleUserRatingsTotal?: number
  photoUrl?: string
  createdAt: string // ISO string
  lastRefreshedAt?: string // ISO string
}

// ============================================
// USER RESTAURANT (Join table response)
// ============================================

export interface UserRestaurant {
  id: number
  restaurant: Restaurant
  status: 'WantToGo' | 'BeenTo' // Backend enum values
  createdAt: string // ISO string
  updatedAt: string // ISO string
  review?: RestaurantReview // Only present if status is BeenTo
}

// Type guards for easy filtering
export interface WantToGoRestaurant extends UserRestaurant {
  status: 'WantToGo'
  review: undefined // Never has review
}

export interface BeenToRestaurant extends UserRestaurant {
  status: 'BeenTo'
  review: RestaurantReview // Always has review
}

// ============================================
// REVIEW TYPES
// ============================================

export interface RestaurantReview {
  id: number
  rating: number // 1-5 stars
  priceRange: number // 1-4 kr symbols
  notes?: string
  photoUrls: string[] // Array of URLs
  visitDate: string // ISO string
  createdAt: string // ISO string
}

export interface CreateReviewDto {
  rating: number // 1-5
  priceRange: number // 1-4
  notes?: string
  photoUrls?: string[]
  visitDate?: string // Optional, defaults to now
}

// ============================================
// SEARCH & ADD TYPES
// ============================================

export interface RestaurantSearchResult {
  googlePlaceId: string
  name: string
  address: string
  rating?: number
  priceLevel?: number // 1-4
  photoUrl?: string
  isAlreadyInMyList: boolean // Backend tells us if we already added it
}

export interface CreateRestaurantFromGoogleDto {
  googlePlaceId: string
}

// ============================================
// ACTIVITY FEED TYPES
// ============================================

export interface Activity {
  id: number
  user: User
  activityType: 'AddedWantToGo' | 'MarkedAsBeenTo'
  restaurant: Restaurant
  review?: RestaurantReview // Only for MarkedAsBeenTo
  createdAt: string // ISO string
}

// ============================================
// FILTER & UI TYPES
// ============================================

export type FilterType = 'all' | 'want-to-go' | 'been-to'

export type RestaurantStatus = 'WantToGo' | 'BeenTo'

// ============================================
// HELPER TYPE GUARDS
// ============================================

export function isWantToGo(restaurant: UserRestaurant): restaurant is WantToGoRestaurant {
  return restaurant.status === 'WantToGo'
}

export function isBeenTo(restaurant: UserRestaurant): restaurant is BeenToRestaurant {
  return restaurant.status === 'BeenTo'
}

// ============================================
// MAP MARKER TYPES
// ============================================

export interface MapMarker {
  id: number
  position: {
    lat: number
    lng: number
  }
  restaurant: Restaurant
  status: RestaurantStatus
  userRestaurantId: number
}

// Helper to convert UserRestaurant to MapMarker
export function toMapMarker(userRestaurant: UserRestaurant): MapMarker | null {
  const { restaurant } = userRestaurant
  
  if (!restaurant.latitude || !restaurant.longitude) {
    return null // Can't show on map without coordinates
  }

  return {
    id: restaurant.id,
    position: {
      lat: restaurant.latitude,
      lng: restaurant.longitude,
    },
    restaurant,
    status: userRestaurant.status,
    userRestaurantId: userRestaurant.id,
  }
}