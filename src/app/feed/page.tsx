"use client";

import { useCurrentUser } from "@/lib/api/userService";
import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function FeedPage() {
  const { isSignedIn, userId, getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const { data: user, isLoading, error } = useCurrentUser();

  // Log Clerk user info
  useEffect(() => {
    const logUserInfo = async () => {
      console.log("=== CLERK USER INFO ===");
      console.log("isSignedIn:", isSignedIn);
      console.log("userId:", userId);
      console.log("clerkUser:", clerkUser);
      console.log("email:", clerkUser?.emailAddresses[0]?.emailAddress);
      console.log("username:", clerkUser?.username);
      
      const token = await getToken({ template: "platemates-api" });
      console.log("token:", token);
      console.log("======================");
    };
    
    if (isSignedIn) {
      logUserInfo();
    }
  }, [isSignedIn, userId, clerkUser, getToken]);

  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error loading user</h1>
        <p className="text-red-500 mb-4">{error.message}</p>
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Clerk User Info (from frontend):</h2>
          <p>Clerk User ID: {userId}</p>
          <p>Email: {clerkUser?.emailAddresses[0]?.emailAddress}</p>
          <p>Username: {clerkUser?.username}</p>
        </div>
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