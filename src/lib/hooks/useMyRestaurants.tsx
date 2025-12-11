"use client";

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { getMyRestaurants } from '@/lib/api/restaurantService';
import type { UserRestaurant } from '@/types/models';

export function useMyRestaurants(status: 'all' | 'want-to-go' | 'been-to' = 'all') {
  const { getToken, isSignedIn } = useAuth();

  return useQuery<UserRestaurant[]>({
    queryKey: ['restaurants', status],
    queryFn: async () => {
      const template = process.env.NODE_ENV === 'production' 
        ? 'platemates-api-production' 
        : 'platemates-api';

      const token = await getToken({ template });

      if (!token) {
        throw new Error('No authentication token');
      }

      return getMyRestaurants(status, token);
    },
    enabled: isSignedIn,
    staleTime: 30 * 1000, 
  });
}