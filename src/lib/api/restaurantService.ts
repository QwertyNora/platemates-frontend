import type { AddRestaurantManuallyDto, UserRestaurant } from '@/types/models';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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