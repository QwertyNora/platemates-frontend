import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Platemates
        </Link>

        <nav className="flex items-center gap-4">
          {/* When NOT logged in */}
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

          {/* When logged in */}
          <SignedIn>
            <Link href="/" className="hover:text-blue-600">
              Feed
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}