// lib/hooks/useRestaurants.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  searchRestaurants,
  addToWantToGo,
  getMyWantToGoList,
  getMyBeenToList,
  markAsBeenTo,
  removeRestaurant,
  type RestaurantSearchResult,
  type UserRestaurant,
} from '@/lib/api/restaurants'

export function useSearchRestaurants(
  query: string,
  latitude?: number,
  longitude?: number
) {
  return useQuery({
    queryKey: ['restaurants', 'search', query, latitude, longitude],
    queryFn: () => searchRestaurants(query, latitude, longitude),
    enabled: query.length > 2, // Only search if query is 3+ characters
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useWantToGoList() {
  return useQuery({
    queryKey: ['restaurants', 'want-to-go'],
    queryFn: getMyWantToGoList,
  })
}

export function useBeenToList() {
  return useQuery({
    queryKey: ['restaurants', 'been-to'],
    queryFn: getMyBeenToList,
  })
}

export function useAddToWantToGo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addToWantToGo,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['restaurants', 'want-to-go'] })
      queryClient.invalidateQueries({ queryKey: ['restaurants', 'search'] })
    },
  })
}

export function useMarkAsBeenTo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, review }: { id: number; review: any }) =>
      markAsBeenTo(id, review),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants', 'want-to-go'] })
      queryClient.invalidateQueries({ queryKey: ['restaurants', 'been-to'] })
    },
  })
}

export function useRemoveRestaurant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] })
    },
  })
}