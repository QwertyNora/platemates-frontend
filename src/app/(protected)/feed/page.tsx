"use client";

import { useCurrentUser } from "@/lib/api/userService";
import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { AddRestaurantModal } from "@/components/features/restaurants/AddRestaurantModal";

export default function FeedPage() {
  const { isSignedIn, userId, getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const { data: user, isLoading, error } = useCurrentUser();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Log Clerk user info
  useEffect(() => {
    const logUserInfo = async () => {
      console.log("=== CLERK USER INFO ===");
      console.log("isSignedIn:", isSignedIn);
      console.log("userId:", userId);
      console.log("clerkUser:", clerkUser);
      console.log("email:", clerkUser?.emailAddresses[0]?.emailAddress);
      console.log("username:", clerkUser?.username);

      const template = process.env.NODE_ENV === 'production' 
      ? 'platemates-api-production' 
      : 'platemates-api';
      
      const token = await getToken({ template });
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
      <div className="max-w-4xl mx-auto">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome, {user?.username}!</h1>
            <p className="text-xl text-gray-600">Email: {user?.email}</p>
          </div>
          
          {/* Add Restaurant Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition shadow-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Restaurant
          </button>
        </div>

        {/* Feed Content */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <p className="text-gray-500 text-center">
            Your feed will appear here. Click "Add Restaurant" to get started!
          </p>
        </div>
      </div>

      {/* Modal */}
      <AddRestaurantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}