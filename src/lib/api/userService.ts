import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

export interface User {
  id: string;
  clerkUserId: string;
  email: string;
  username: string;
  createdAt: string;
  location?: string;
  description?: string;
}

// Client component hook
export function useCurrentUser() {
  const { isSignedIn, getToken } = useAuth();

  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: async () => {
       const token = await getToken({ template: "platemates-api" });
      
      if (!token) {
        console.error("No token available from Clerk");
        throw new Error("No authentication token");
      }
      
      console.log("Fetching user with token:", token.substring(0, 50) + "...");
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", response.status, errorText);
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("User data received:", data);
      return data;
    },
    enabled: isSignedIn,
    retry: false, // Disable retry to stop infinite loop
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}