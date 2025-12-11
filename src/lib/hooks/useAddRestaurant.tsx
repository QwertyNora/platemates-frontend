"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { addRestaurantManually } from '@/lib/api/restaurantService';
import type { AddRestaurantManuallyDto, UserRestaurant } from '@/types/models';

export function useAddRestaurantManually() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: AddRestaurantManuallyDto): Promise<UserRestaurant> => {
      const template = process.env.NODE_ENV === 'production' 
        ? 'platemates-api-production' 
        : 'platemates-api';

      const token = await getToken({ template });

      if (!token) {
        throw new Error('No authentication token');
      }

      return addRestaurantManually(dto, token);
    },
    onSuccess: () => {
      // Invalidate restaurant queries when we add one
      // (We'll add these query keys later when we implement the list view)
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
}