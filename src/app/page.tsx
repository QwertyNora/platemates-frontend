import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Background } from "@/components/ui/Background";

export default async function Home() {
  const { userId } = await auth();
  
  // If logged in, redirect to feed
  if (userId) {
    redirect("/feed");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <Background />
      <div className="text-center max-w-2xl relative">
        {/* Glowing background light effect */}
        <div className="absolute inset-0 bg-amber-100/20 blur-3xl rounded-full scale-110 -z-10" />
        
        {/* Logo/Icon */}
        <div className="mb-8 inline-block">
          <div className="w-20 h-20 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl rotate-3 hover:rotate-0 transition-transform duration-300 relative">
            <Image 
              src="/cutlery.png" 
              alt="Platemates logo"
              width={48}
              height={48}
              className="object-contain drop-shadow-sm"
            />
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-bold mb-4 text-white" style={{ textShadow: '0 0 1px #ea580c, 0 0 2px #ea580c, 0 0 3px #ea580c' }}>
          Platemates
        </h1>
        
        {/* Subtitle */}
        <div className="relative inline-block mb-12">
          <p className="text-xl md:text-2xl text-slate-800 font-light"
          >
            Discover, save, and share your favorite restaurants
          </p>
          <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 400 12" preserveAspectRatio="none">
            <path
              d="M 0 6 Q 10 3, 20 6 T 40 6 T 60 6 T 80 6 T 100 6 T 120 6 T 140 6 T 160 6 T 180 6 T 200 6 T 220 6 T 240 6 T 260 6 T 280 6 T 300 6 T 320 6 T 340 6 T 360 6 T 380 6 T 400 6"
              stroke="#f97316"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/sign-up"
            className="bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-orange-700 transition-all shadow-sm hover:shadow-md hover:scale-[1.02] transform duration-200"
          >
            Get Started
          </Link>
          <Link
            href="/sign-in"
            className="bg-white text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all border border-slate-200 hover:border-orange-300 hover:scale-[1.02] transform duration-200"
          >
            Sign In
          </Link>
        </div>
        
        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-sm">
            <div className="text-3xl mb-3">📍</div>
            <h3 className="font-semibold text-slate-900 mb-2">Save Places</h3>
            <p className="text-sm text-slate-600">Keep track of restaurants you want to visit</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-sm">
            <div className="text-3xl mb-3">🗺️</div>
            <h3 className="font-semibold text-slate-900 mb-2">Explore Map</h3>
            <p className="text-sm text-slate-600">Visualize your restaurant collection</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-sm">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="font-semibold text-slate-900 mb-2">Track Reviews</h3>
            <p className="text-sm text-slate-600">Remember your favorite dishes and experiences</p>
          </div>
        </div>
      </div>
    </main>
  );
}