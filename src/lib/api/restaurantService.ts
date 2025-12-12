import type { 
  AddRestaurantManuallyDto, 
  AddReviewDto,
  GooglePlacesSearchResult,
  UpdateRestaurantDto,
  UserRestaurant 
} from '@/types/models';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Search for restaurants using Google Places
 */
export async function searchRestaurants(
    query: string,
    token: string
): Promise<GooglePlacesSearchResult> {
    const response = await fetch(
        `${API_BASE_URL}/api/restaurants/search?query=${encodeURIComponent(query)}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    if (!response.ok){
        const errorText = await response.text();
        throw new Error(`Failed to search restaurants: ${response.status} - ${errorText}`);
    }

    return response.json();
}


/**
 * Add a restaurant manually to "Want to Go" list
 */
export async function addRestaurantManually(
  dto: AddRestaurantManuallyDto,
  token: string
): Promise<UserRestaurant> {
  const response = await fetch(`${API_BASE_URL}/api/restaurants/manual`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to add restaurant: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Get current user's restaurants
 * @param status - Filter: "all", "want-to-go", or "been-to"
 * @param token - JWT token from Clerk
 */
export async function getMyRestaurants(
  status: 'all' | 'want-to-go' | 'been-to',
  token: string
): Promise<UserRestaurant[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/restaurants/my-list?status=${status}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch restaurants: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Mark a restaurant as "Been To" and add a review
 */
export async function markAsBeenTo(
  userRestaurantId: string,
  reviewDto: AddReviewDto,
  token: string
): Promise<UserRestaurant> {
  const response = await fetch(
    `${API_BASE_URL}/api/restaurants/${userRestaurantId}/mark-as-been-to`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reviewDto),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to mark as been to: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Mark a restaurant back to "Want to Go" (deletes review)
 */
export async function markAsWantToGo(
  userRestaurantId: string,
  token: string
): Promise<UserRestaurant> {
  const response = await fetch(
    `${API_BASE_URL}/api/restaurants/${userRestaurantId}/review`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to mark as want to go: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Update restaurant information (PATCH - only updates provided fields)
 */
export async function updateRestaurant(
  userRestaurantId: string,
  dto: UpdateRestaurantDto,
  token: string
): Promise<UserRestaurant> {
  const response = await fetch(
    `${API_BASE_URL}/api/restaurants/${userRestaurantId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update restaurant: ${response.status} - ${errorText}`);
  }

  return response.json();
}