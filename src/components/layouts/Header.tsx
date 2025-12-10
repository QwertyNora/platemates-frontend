"use client";

import { SignInButton, SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useBackendUser } from "@/lib/hooks/useBackendUser";

export function Header() {
  const { isSignedIn } = useAuth(); // Add this
  
  // Only call useBackendUser when signed in
  const { data: backendUser, isLoading, isError } = useBackendUser();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Platemates
        </Link>

        <nav className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-blue-600 hover:text-blue-800">
                Sign In
              </button>
            </SignInButton>
            <Link
              href="/sign-up"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </SignedOut>

          <SignedIn>
            <Link href="/feed" className="hover:text-blue-600">
              Feed
            </Link>

            {/* Only show username when we have the data */}
            {isSignedIn && !isLoading && !isError && backendUser && (
              <span className="text-xs text-gray-500">
                {backendUser.username}
              </span>
            )}

            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}