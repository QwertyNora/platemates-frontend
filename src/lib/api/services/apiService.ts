// services/apiService.ts
import { auth } from '@clerk/nextjs/server'
import type {
  UserRestaurant,
  RestaurantSearchResult,
  CreateRestaurantFromGoogleDto,
  CreateReviewDto,
  User,
  UpdateUserDto,
  Activity,
} from '@/types/models'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// ============================================
// AUTH HELPER
// ============================================

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const { getToken } = await auth()
  const token = await getToken()

  if (!token) {
    throw new Error('Not authenticated')
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `Request failed with status ${response.status}`)
  }

  return response.json()
}

// ============================================
// RESTAURANT APIs
// ============================================

/**
 * Search for restaurants using Google Places API
 * @param query - Search term (e.g., "pizza", "sushi stockholm")
 * @param latitude - Optional user latitude for location-based search
 * @param longitude - Optional user longitude for location-based search
 */
export async function searchRestaurants(
  query: string,
  latitude?: number,
  longitude?: number
): Promise<RestaurantSearchResult[]> {
  const params = new URLSearchParams({ query })
  
  if (latitude !== undefined && longitude !== undefined) {
    params.append('latitude', latitude.toString())
    params.append('longitude', longitude.toString())
  }

  return fetchWithAuth(`${BASE_URL}/api/restaurant/search?${params}`)
}

/**
 * Add a restaurant to "Want to go" list
 * @param googlePlaceId - Google Place ID from search results
 */
export async function addRestaurant(
  googlePlaceId: string
): Promise<UserRestaurant> {
  return fetchWithAuth(`${BASE_URL}/api/restaurant/want-to-go`, {
    method: 'POST',
    body: JSON.stringify({ googlePlaceId } as CreateRestaurantFromGoogleDto),
  })
}

/**
 * Get current user's "Want to go" list
 */
export async function getWantToGoList(): Promise<UserRestaurant[]> {
  return fetchWithAuth(`${BASE_URL}/api/restaurant/want-to-go`)
}

/**
 * Get current user's "Been to" list
 */
export async function getBeenToList(): Promise<UserRestaurant[]> {
  return fetchWithAuth(`${BASE_URL}/api/restaurant/been-to`)
}

/**
 * Get a specific user restaurant by ID
 */
export async function getUserRestaurant(id: number): Promise<UserRestaurant> {
  return fetchWithAuth(`${BASE_URL}/api/restaurant/${id}`)
}

/**
 * Mark a restaurant as "Been to" and add review
 * @param id - UserRestaurant ID (not Restaurant ID!)
 * @param review - Review data
 */
export async function markAsBeenTo(
  id: number,
  review: CreateReviewDto
): Promise<UserRestaurant> {
  return fetchWithAuth(`${BASE_URL}/api/restaurant/${id}/mark-as-been`, {
    method: 'POST',
    body: JSON.stringify(review),
  })
}

/**
 * Remove a restaurant from your list
 * @param id - UserRestaurant ID
 */
export async function removeRestaurant(id: number): Promise<void> {
  await fetchWithAuth(`${BASE_URL}/api/restaurant/${id}`, {
    method: 'DELETE',
  })
}

/**
 * Refresh restaurant data from Google Places API
 * @param restaurantId - Restaurant ID (not UserRestaurant ID!)
 */
export async function refreshRestaurantData(
  restaurantId: number
): Promise<UserRestaurant> {
  return fetchWithAuth(`${BASE_URL}/api/restaurant/${restaurantId}/refresh`, {
    method: 'PUT',
  })
}

/**
 * Get another user's "Want to go" list
 */
export async function getUserWantToGoList(userId: number): Promise<UserRestaurant[]> {
  return fetchWithAuth(`${BASE_URL}/api/restaurant/users/${userId}/want-to-go`)
}

/**
 * Get another user's "Been to" list with reviews
 */
export async function getUserBeenToList(userId: number): Promise<UserRestaurant[]> {
  return fetchWithAuth(`${BASE_URL}/api/restaurant/users/${userId}/been-to`)
}

// ============================================
// USER APIs
// ============================================

/**
 * Get current user (auto-creates if doesn't exist)
 */
export async function getCurrentUser(): Promise<User> {
  return fetchWithAuth(`${BASE_URL}/api/user/me`)
}

/**
 * Update current user's profile
 */
export async function updateUser(data: UpdateUserDto): Promise<User> {
  return fetchWithAuth(`${BASE_URL}/api/user/me`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Get user by ID
 */
export async function getUserById(id: number): Promise<User> {
  return fetchWithAuth(`${BASE_URL}/api/user/${id}`)
}

/**
 * Follow a user
 */
export async function followUser(userId: number): Promise<void> {
  await fetchWithAuth(`${BASE_URL}/api/user/${userId}/follow`, {
    method: 'POST',
  })
}

/**
 * Unfollow a user
 */
export async function unfollowUser(userId: number): Promise<void> {
  await fetchWithAuth(`${BASE_URL}/api/user/${userId}/follow`, {
    method: 'DELETE',
  })
}

/**
 * Get user's followers
 */
export async function getUserFollowers(userId: number): Promise<User[]> {
  return fetchWithAuth(`${BASE_URL}/api/user/${userId}/followers`)
}

/**
 * Get users that a user is following
 */
export async function getUserFollowing(userId: number): Promise<User[]> {
  return fetchWithAuth(`${BASE_URL}/api/user/${userId}/following`)
}

// ============================================
// FEED APIs
// ============================================

/**
 * Get activity feed from users you follow
 * @param pageSize - Number of items per page (1-50, default 20)
 * @param page - Page number (default 1)
 */
export async function getFeed(
  pageSize: number = 20,
  page: number = 1
): Promise<Activity[]> {
  const params = new URLSearchParams({
    pageSize: pageSize.toString(),
    page: page.toString(),
  })
  
  return fetchWithAuth(`${BASE_URL}/api/feed?${params}`)
}

/**
 * Get a specific user's activity history
 */
export async function getUserActivities(
  userId: number,
  pageSize: number = 20,
  page: number = 1
): Promise<Activity[]> {
  const params = new URLSearchParams({
    pageSize: pageSize.toString(),
    page: page.toString(),
  })
  
  return fetchWithAuth(`${BASE_URL}/api/feed/users/${userId}?${params}`)
}

// ============================================
// ERROR HANDLING HELPER
// ============================================

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Helper to handle API errors consistently
 */
export function handleApiError(error: unknown): never {
  if (error instanceof ApiError) {
    throw error
  }
  
  if (error instanceof Error) {
    throw new ApiError(error.message)
  }
  
  throw new ApiError('An unknown error occurred')
}




// Endpoints:

// // Sök restauranger (via Google Places API)
// GET /api/restaurants/search?query=oaxen

// // Lägg till i "want-to-go"
// POST /api/restaurants/want-to-go
// Body: { googlePlaceId: "ChIJ..." }

// // Hämta mina listor
// GET /api/restaurants/want-to-go    // Min want-to-go lista
// GET /api/restaurants/been-to        // Min been-to lista (med mina reviews)

// // Markera som besökt
// POST /api/restaurants/{id}/mark-as-been
// Body: { rating: 4, priceRange: 3, notes: "...", photoUrls: [...] }

// // Ta bort från lista
// DELETE /api/restaurants/{id}

// // Se andra users listor
// GET /api/users/{userId}/restaurants/want-to-go
// GET /api/users/{userId}/restaurants/been-to    // Med deras reviews