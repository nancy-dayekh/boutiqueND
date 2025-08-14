"use client";

import { useState, useEffect, useRef } from "react";
import NewCollection from "./NewCollection/page";
import DesignCategory from "./homepage/categoryproducts/designcategory";
import Products from "./products/product/product";
import ShopDresses from "./homepage/shopdressesdesign/shopdresses";
import ShopBlazer from "./homepage/shopblazerdesgin/shopblazer";
import DesignJeans from "./homepage/displayjeans/designjeans";
import About from "./about/page";
import Image from "next/image";

const slides = [
  { type: "video", src: "/video/contactuss.mp4" },
  { type: "image", src: "/image/homeslider2.jpg" },
  { type: "video", src: "/video/homeslider3.mp4 " },
];

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

export default function Homepage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set up scroll event listener for animations
    window.addEventListener("scroll", handleScrollAnimation);
    // Trigger animation on mount (in case some elements are already visible)
    handleScrollAnimation();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("scroll", handleScrollAnimation);
    };
  }, []);
  useEffect(() => {
    if (!sessionStorage.getItem("hasRefreshed")) {
      sessionStorage.setItem("hasRefreshed", "true");
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex]);

  const prevSlide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      {/* --- Slider Section --- */}
      {/* --- Slider Section --- */}
      <div
        className="
    relative 
    w-full 
    h-[400px]         /* bigger height by default (mobile) */
    sm:h-[330px]      /* smaller height on sm and up */
    overflow-hidden 
    group
  "
      >
        <div className="px-0 sm:px-[40px]">
          <div
            className="flex gap-[20px] transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-full h-[400px] sm:h-[330px] rounded-[10px] overflow-hidden"
              >
                {slide.type === "video" ? (
                  <video
                    src={slide.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={slide.src}
                    alt={`Slide ${idx}`}
                    width={1920} // your desired width
                    height={1080} // your desired height
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute top-1/2 left-2 sm:left-[40px] -translate-y-1/2 w-[60px] h-[38px] bg-white bg-opacity-90 rounded-[10px] shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:bg-gray-100 hover:shadow-xl cursor-pointer transform hover:scale-105"
        >
          <div className="w-0 h-0 border-y-[7px] border-y-transparent border-r-[10px] border-r-black ml-[6px]" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute top-1/2 right-2 sm:right-[40px] -translate-y-1/2 w-[60px] h-[38px] bg-white bg-opacity-90 rounded-[10px] shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:bg-gray-100 hover:shadow-xl cursor-pointer transform hover:scale-105"
        >
          <div className="w-0 h-0 border-y-[7px] border-y-transparent border-l-[10px] border-l-black mr-[6px]" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? "bg-black scale-125 shadow-lg"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Category Section */}
      <div className="mt-10 animate-scroll opacity-0 translate-y-5 transition-all duration-700 ease-out will-change-transform">
        <DesignCategory />
      </div>

      {/* New Collection Section */}
      <div className="mt-10 animate-scroll opacity-0 translate-y-5 transition-all duration-700 ease-out will-change-transform">
        <NewCollection />
      </div>

      <div className="mt-10 mb-28 animate-scroll opacity-0 translate-y-5 transition-all duration-700 ease-out will-change-transform">
        <ShopDresses />
      </div>

      {/* Header Line + View More */}
      <div className="w-full flex flex-col mb-10 px-4 sm:px-0 md:ml-20 animate-scroll opacity-0 translate-y-5 transition-all duration-700 ease-out will-change-transform">
        <div className="flex w-full max-w-6xl gap-4 sm:gap-8">
          <h1 className="text-base sm:text-xl font-medium tracking-widest uppercase text-black whitespace-nowrap">
            Handpicked Favorites
          </h1>
        </div>
      </div>

      {/* Products Section */}
      <div className="flex justify-center items-center mb-28 animate-scroll opacity-0 translate-y-5 transition-all duration-700 ease-out will-change-transform">
        <Products products={products.slice(0, 8)} />
      </div>

      <div className="mt-28 mb-28 animate-scroll opacity-0 translate-y-5 transition-all duration-700 ease-out will-change-transform">
        <ShopBlazer />
      </div>

      <div className="mt-28 mb-28 animate-scroll opacity-0 translate-y-5 transition-all duration-700 ease-out will-change-transform">
        <DesignJeans />
      </div>
      <div className="mt-28 mb-28 animate-scroll opacity-0 translate-y-5 transition-all duration-700 ease-out will-change-transform">
        <About />
      </div>
    </>
  );
}
