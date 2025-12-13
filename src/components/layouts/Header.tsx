"use client";

import { SignInButton, SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import { useBackendUser } from "@/lib/hooks/useBackendUser";
import { Logo } from "../ui/Logo";

export function Header() {
  const { isSignedIn } = useAuth();
  
  // Only call useBackendUser when signed in
  const { data: backendUser, isLoading, isError } = useBackendUser();

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-cream-50/95 backdrop-blur-lg border-b border-cream-300/60 shadow-sm"
    >
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Logo />

          <nav className="flex items-center gap-3 sm:gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-1.5 text-sm text-slate-700 font-medium hover:text-orange-600 transition-colors"
                >
                  Sign In
                </motion.button>
              </SignInButton>
              <Link href="/sign-up">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-1.5 text-sm bg-orange-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md hover:bg-orange-700 transition-all"
                >
                  Sign Up
                </motion.div>
              </Link>
            </SignedOut>

            <SignedIn>
              <Link href="/feed">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-1.5 text-sm text-slate-700 font-medium hover:text-orange-600 transition-colors"
                >
                  Feed
                </motion.div>
              </Link>

              {isSignedIn && !isLoading && !isError && backendUser && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden sm:flex px-3 py-1 bg-white text-orange-600 text-xs rounded-lg border border-orange-200 shadow-sm"
                >
                  @{backendUser.username}
                </motion.div>
              )}

              <div className="ml-1 sm:ml-2">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 sm:w-10 sm:h-10 ring-2 ring-orange-200 hover:ring-orange-400 transition-all"
                    }
                  }}
                />
              </div>
            </SignedIn>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}