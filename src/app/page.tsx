import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  
  // If logged in, redirect to feed
  if (userId) {
    redirect("/feed");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-6xl font-bold mb-8">Platemates</h1>
      <p className="text-xl mb-8 text-gray-600">Share meals with mates</p>
      
      <div className="flex gap-4">
        <Link
          href="/sign-in"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}