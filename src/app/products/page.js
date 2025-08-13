"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Collection() {
  const [categories, setCategories] = useState([]);
  const imageBaseURL = "http://127.0.0.1:8000/storage/";

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCategories(data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch categories", err));
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-light uppercase tracking-widest text-center mb-12">
          Shop by Collection
        </h2>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-4 sm:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products/${encodeURIComponent(cat.name)}`}
              className="block w-full sm:w-[300px]"
            >
              <div className="relative overflow-hidden border-4 border-white transition-transform duration-300 hover:scale-105">
                <Image
                  src={
                    cat.image ? `${imageBaseURL}${cat.image}` : "/placeholder.png"
                  }
                  alt={cat.name}
                  className="w-full h-[180px] sm:h-[400px] object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-white/90 py-3 text-center">
                  <p className="text-black text-sm font-medium tracking-wide uppercase">
                    {cat.name}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
