"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Shopbresses() {
  const router = useRouter();
  const handleCheckouts = () => router.push("/products/blazer");

  return (
    <div className="w-full bg-white px-[10px] md:px-[10px] py-2"> {/* white bg + 2px left/right */}
      <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg">
        {/* Full Image */}
        <Image
          src="/image/shopblazer.jpg"
          alt="Blazer"
          fill
          className="object-cover"
          priority
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/10" />

        {/* Text content */}
        <div className="absolute inset-0 flex items-center justify-start px-2 md:px-6">
          <div className="text-white text-left max-w-xl space-y-4 bg-black/40 p-4 rounded-lg backdrop-blur-sm">
            <p className="uppercase text-xs md:text-sm tracking-widest">
              Made for Modern Women
            </p>
            <h1 className="text-2xl md:text-5xl font-bold uppercase leading-tight">
              2025 Summer Blazer Collection
            </h1>

            <button
              onClick={handleCheckouts}
              className="w-full sm:w-auto px-6 py-3 bg-white text-black rounded-md font-semibold hover:bg-pink-500 transition duration-300"
            >
              Shop Blazer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
