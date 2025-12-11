"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { 
  markAsBeenTo, 
  markAsWantToGo, 
  updateRestaurant 
} from '@/lib/api/restaurantService';
import type { AddReviewDto, UpdateRestaurantDto, UserRestaurant } from '@/types/models';

/**
 * Hook to mark a restaurant as "Been To" with a review
 */
export function useMarkAsBeenTo() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userRestaurantId, 
      reviewDto 
    }: { 
      userRestaurantId: string; 
      reviewDto: AddReviewDto;
    }): Promise<UserRestaurant> => {
      const template = process.env.NODE_ENV === 'production' 
        ? 'platemates-api-production' 
        : 'platemates-api';

      const token = await getToken({ template });

      if (!token) {
        throw new Error('No authentication token');
      }

      return markAsBeenTo(userRestaurantId, reviewDto, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
}

/**
 * Hook to mark a restaurant back to "Want to Go" (deletes review)
 */
export function useMarkAsWantToGo() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userRestaurantId: string): Promise<UserRestaurant> => {
      const template = process.env.NODE_ENV === 'production' 
        ? 'platemates-api-production' 
        : 'platemates-api';

      const token = await getToken({ template });

      if (!token) {
        throw new Error('No authentication token');
      }

      return markAsWantToGo(userRestaurantId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
}

/**
 * Hook to update restaurant information
 */
export function useUpdateRestaurant() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userRestaurantId, 
      dto 
    }: { 
      userRestaurantId: string; 
      dto: UpdateRestaurantDto;
    }): Promise<UserRestaurant> => {
      const template = process.env.NODE_ENV === 'production' 
        ? 'platemates-api-production' 
        : 'platemates-api';

      const token = await getToken({ template });

      if (!token) {
        throw new Error('No authentication token');
      }

      return updateRestaurant(userRestaurantId, dto, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
}