"use client";

import { useEffect } from "react";

// Scroll animation using Tailwind utility classes
const handleScrollAnimation = () => {
  const elements = document.querySelectorAll(".animate-scroll");
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.85) {
      el.classList.add("opacity-100", "translate-y-0");
      el.classList.remove("opacity-0", "translate-y-5");
    } else {
      el.classList.remove("opacity-100", "translate-y-0");
      el.classList.add("opacity-0", "translate-y-5");
    }
  });
};

export default function About() {
  useEffect(() => {
    window.addEventListener("scroll", handleScrollAnimation);
    handleScrollAnimation();
    return () => {
      window.removeEventListener("scroll", handleScrollAnimation);
    };
  }, []);

  return (
    <div className="w-full bg-white font-sans">
      {/* Hero Section */}
      <div className="w-full px-4 sm:px-6 md:px-10 mt-[15px]">
        <div className="relative w-full h-[300px] sm:h-[330px] overflow-hidden rounded-xl shadow-lg">
          <video
            src="/video/contactuss.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-light tracking-widest uppercase">
             About us

            </h1>
          </div>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-4xl mx-auto px-6 text-center py-16">
        <p
          className="text-lg text-gray-700 leading-relaxed opacity-0 translate-y-5 transition-all duration-700 ease-out will-change-transform animate-scroll"
          style={{ transitionDelay: "150ms" }}
        >
          At <strong>Boutique ND</strong>, we craft every garment with love and
          care, bringing you clothes that users truly cherish and enjoy wearing.
        </p>
        <p
          className="text-sm text-gray-500 mt-2 opacity-0 translate-y-5 transition-all duration-700 ease-out animate-scroll"
          style={{ transitionDelay: "300ms" }}
        >
          Made with passion. Worn with happiness.
        </p>
      </div>

      {/* Section 1 */}
      <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl mx-auto px-6 py-16">
        <div
          className="w-full flex justify-center opacity-0 translate-y-5 transition-all duration-700 ease-out will-change-transform animate-scroll"
          style={{ transitionDelay: "450ms" }}
        >
          <video
            src="/video/aboutvideo2.mp4"
            controls
            autoPlay
            loop
            muted
            tabIndex={0}
            className="rounded-xl shadow-xl transition-transform duration-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-400 w-full max-w-[600px] h-[320px] object-cover"
            aria-label="About Boutique ND craftsmanship video"
          />
        </div>

        <div
          className="text-gray-700 text-lg leading-relaxed opacity-0 translate-y-5 transition-all duration-700 ease-out will-change-transform animate-scroll"
          style={{ transitionDelay: "600ms" }}
        >
          Every piece we create reflects careful craftsmanship — from handpicked
          natural fabrics to delicate stitching and elegant trims. Our garments
          speak the language of quiet luxury — simple, refined, and magical.
        </div>
      </div>
    </div>
  );
}
