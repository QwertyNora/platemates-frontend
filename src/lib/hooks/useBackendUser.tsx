"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export function useBackendUser() {
  const { isSignedIn, getToken } = useAuth();

  const query = useQuery({
    queryKey: ["backendUser"],
    enabled: isSignedIn, 
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined");
      }
      
      const token = await getToken({ template: "platemates-api" });
      if (!token) {
        throw new Error("No Clerk token");
      }

      const res = await fetch(
        `${apiUrl}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      return res.json(); 
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return query;
}