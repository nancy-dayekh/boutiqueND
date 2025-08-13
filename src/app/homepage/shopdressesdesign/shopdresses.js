"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Shopdresses() {
  const router = useRouter();
  const handleCheckouts = () => router.push("/products/dresses");

  return (
    <div className="w-full px-4 md:px-10"> {/* Add space to left/right */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-black rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
        {/* Full Image, always fully visible */}
        <Image
          src="/image/homedresses.jpg"
          alt="Dresses"
          fill
          className="object-contain"
          priority
        />

        {/* Optional gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/10" />

        {/* Text content */}
        <div className="absolute inset-0 flex items-center justify-end px-4 md:px-24">
          <div className="text-white text-right max-w-xl space-y-4 bg-black/40 p-4 rounded-lg backdrop-blur-sm">
            <p className="uppercase text-xs md:text-sm tracking-widest">
              Made for Modern Women
            </p>
            <h1 className="text-2xl md:text-5xl font-bold uppercase leading-tight">
              2025 Summer Dress Collection
            </h1>
    
               <button
                  onClick={handleCheckouts}
                  className="w-full sm:w-auto px-6 py-3 bg-white text-black rounded-md font-semibold hover:bg-pink transition"
                >
                   Shop Dresses
                </button>
          </div>
        </div>
      </div>
    </div>
  );
}
