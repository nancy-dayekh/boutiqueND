"use client";

import { useState, useEffect } from "react";
import Products from "../../products/product/product";

export default function DesignJeangs() {
  const [products, setProducts] = useState([]);
  const url = "http://127.0.0.1:8000/api/products/category/jeans";

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching jeans products:", err));
  }, []);

  return (
    <>
      {/* Header */}
      <div className="w-full flex flex-col mb-10 px-4 sm:px-0 md:ml-20">
        <div className="flex w-full max-w-6xl gap-4 sm:gap-8">
          <h1 className="text-base sm:text-xl font-medium tracking-widest uppercase text-black whitespace-nowrap">
            Versatile Pants Collection
          </h1>
        </div>
      </div>

      {/* Products Section */}
      <div className="flex justify-center items-center mb-28">
        {products.length > 0 ? (
          <Products products={products.slice(0, 4)} />
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>
    </>
  );
}
