"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const fallbackImage = "/placeholder.png"; // ضع صورة افتراضية هنا

export default function DesignCategory() {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    fetch("https://devflowlb.com/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCategories(data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch categories", err));
  }, []);

  return (
    <div className="px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products/${encodeURIComponent(cat.name)}`}
            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 shadow">
              <Image
                src={cat.image || fallbackImage} // صححت هنا
                alt={cat.name || "category image"} // صححت هنا
                width={96} // يمكن استخدام fill إذا أردت ملء العنصر
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-2 text-sm text-center text-black">{cat.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
