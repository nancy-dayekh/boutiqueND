"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Image from "next/image";

const fallbackImage = "/default-product.png";

export default function NewCollection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  const imageBaseURL = "http://127.0.0.1:8000/storage/";

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/productsNewcollection"
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const totalProducts = products.length;

  // Number of columns and rows
  const columns = isMobile ? 2 : 3;
  const rows = 2;

  // Total visible products
  const visibleCount = columns * rows;

  // Step for navigation: move by columns (one row at a time)
  const step = columns;

  // Wrap index helper
  const getIndex = (index) => (index + totalProducts) % totalProducts;

  // Get visible products
  const displayedProducts = [];
  for (let i = 0; i < visibleCount; i++) {
    displayedProducts.push(products[getIndex(currentIndex + i)]);
  }

  const handleNext = () => {
    setCurrentIndex(getIndex(currentIndex + step));
  };

  const handlePrevious = () => {
    setCurrentIndex(getIndex(currentIndex - step));
  };

  const handleProductClick = (id) => {
    router.push(`/products/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-pink-500 border-solid"></div>
      </div>
    );
  }

  if (totalProducts === 0) {
    return (
      <p className="text-center py-20 text-gray-500">No products found.</p>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-2 py-10 mt-[30px] mb-[80px]">
      {/* Title */}
      <div className="w-full flex items-center justify-center mt-[15px] mb-[48px] px-0">
        <div className="flex items-center w-full max-w-6xl gap-4">
          <hr className="flex-1 border-t border-[#dcdcdc]" />
          <h1 className="text-[16px] font-medium tracking-[0.3em] uppercase text-black text-center whitespace-nowrap">
            New Collection
          </h1>
          <hr className="flex-1 border-t border-[#dcdcdc]" />
        </div>
      </div>

      {/* Grid + Arrows */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={handlePrevious}
          aria-label="Previous"
          className="flex items-center justify-center absolute top-1/2 left-0 -translate-y-1/2 w-10 h-10 bg-white shadow rounded-full hover:bg-pink-50 transition z-20"
        >
          <FiChevronLeft size={24} className="text-pink-600" />
        </button>

        {/* Product Grid */}
        <div
          className={`grid ${
            isMobile ? "grid-cols-2" : "grid-cols-3"
          } grid-rows-2 gap-4`}
        >
          {displayedProducts.map(
            (product) =>
              product && (
                <div
                  key={product.id}
                  className="group relative cursor-pointer overflow-hidden rounded-md shadow-md"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="relative w-full h-[300px] sm:h-[250px] overflow-hidden rounded-lg">
                    <Image
                      src={`${imageBaseURL}${product.image || ""}`}
                      alt={product.name || "product image"}
                      fill
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackImage;
                      }}
                      className="object-cover transition-transform duration-300 transform group-hover:scale-105"
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-semibold text-base">
                      {product.name}
                    </h3>
                    <p className="text-white font-light mt-0.5">
                      ${product.price}
                    </p>
                  </div>
                </div>
              )
          )}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          aria-label="Next"
          className="flex items-center justify-center absolute top-1/2 right-0 -translate-y-1/2 w-10 h-10 bg-white shadow rounded-full hover:bg-pink-50 transition z-20"
        >
          <FiChevronRight size={24} className="text-pink-600" />
        </button>
      </div>
    </section>
  );
}
