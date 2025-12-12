"use client";

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { searchRestaurants } from '@/lib/api/restaurantService';
import type { GooglePlacesSearchResult } from '@/types/models';

export function useSearchRestaurants() {
  const { getToken, isLoaded } = useAuth();  // ← Använd isLoaded istället
  const [results, setResults] = useState<GooglePlacesSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
  if (!query.trim()) {
    setResults(null);
    return;
  }

  if (!isLoaded) {
    return;
  }

  setIsLoading(true);
  setError(null);

  try {
    const template = process.env.NODE_ENV === 'production' 
      ? 'platemates-api-production' 
      : 'platemates-api';

    const token = await getToken({ template });

    console.log('🔑 Token:', token ? 'EXISTS' : 'NULL');  // ← LÄGG TILL
    console.log('🔑 Template:', template);  // ← LÄGG TILL

    if (!token) {
      throw new Error('No authentication token');
    }

    const searchResults = await searchRestaurants(query, token);
    setResults(searchResults);
  } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search restaurants');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setError(null);
  };

  return {
    results,
    isLoading,
    error,
    search,
    clearResults,
  };
}