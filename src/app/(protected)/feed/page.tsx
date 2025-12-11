"use client";

import { useCurrentUser } from "@/lib/api/services/userService";
import { useAuth, useUser } from "@clerk/nextjs";

export default function FeedPage() {
  const { isSignedIn, userId } = useAuth();
  const { user: clerkUser } = useUser();
  const { data: user, isLoading, error } = useCurrentUser();

  // Simple logging - check console to see user info
  if (isSignedIn && clerkUser) {
    console.log("=== USER INFO ===");
    console.log("Clerk User ID:", userId);
    console.log("Email:", clerkUser.emailAddresses[0]?.emailAddress);
    console.log("Username:", clerkUser.username);
    console.log("Backend User:", user);
    console.log("=================");
  }

  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Backend error:", error);
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome, {clerkUser?.username}!</h1>
        <p className="text-xl">Email: {clerkUser?.emailAddresses[0]?.emailAddress}</p>
        <p className="text-sm text-red-500 mt-4">
          ⚠️ Backend connection issue (check console)
        </p>
        
        {/* TODO: Add feed content here */}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome, {user?.username}!</h1>
      <p className="text-xl">Email: {user?.email}</p>
      <p className="text-gray-600">User ID: {user?.id}</p>
      
      {/* TODO: Add feed content here */}
    </div>
  );
}