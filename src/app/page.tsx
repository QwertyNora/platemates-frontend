import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Background } from "@/components/ui/Background";
import { MapPin, Map, Star } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();
  
  // If logged in, redirect to feed
  if (userId) {
    redirect("/feed");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <Background />
      
      <div className="text-center max-w-2xl relative z-10">
        {/* Glowing background light effect */}
        <div className="absolute inset-0 bg-orange-500/10 blur-3xl rounded-full scale-110 -z-10" />
        
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
        <h1 className="font-outfit text-6xl md:text-7xl font-bold mb-4 text-white drop-shadow-lg">
          Platemates
        </h1>
        
        {/* Subtitle */}
        <div className="relative inline-block mb-12">
          <p className="font-outfit italic text-xl md:text-2xl text-orange-800 font-light">
            Discover, save, and share your favorite restaurants
          </p>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/sign-up"
            className="bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] transform duration-200"
          >
            Get Started
          </Link>
          <Link
            href="/sign-in"
            className="bg-white/95 backdrop-blur-sm text-slate-800 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-white transition-all border border-white/50 hover:border-orange-300 hover:scale-[1.02] transform duration-200 shadow-lg"
          >
            Sign In
          </Link>
        </div>
        
        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl border border-white/70 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2 text-center">Save Places</h3>
            <p className="text-sm text-slate-600 text-center">Keep track of restaurants you want to visit</p>
          </div>
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl border border-white/70 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Map className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2 text-center">Explore Map</h3>
            <p className="text-sm text-slate-600 text-center">Visualize your restaurant collection</p>
          </div>
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl border border-white/70 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2 text-center">Track Reviews</h3>
            <p className="text-sm text-slate-600 text-center">Remember your favorite dishes and experiences</p>
          </div>
        </div>
      </div>
    </main>
  );
}