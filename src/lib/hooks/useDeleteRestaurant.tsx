import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRestaurant } from "../api/restaurantService";

/**
 * Hook to delete a restaurant
 */
export function useDeleteRestaurant() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userRestaurantId: string): Promise<void> => {
      const template = process.env.NODE_ENV === 'production' 
        ? 'platemates-api-production' 
        : 'platemates-api';

      const token = await getToken({ template });

      if (!token) {
        throw new Error('No authentication token');
      }

      return deleteRestaurant(userRestaurantId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
}