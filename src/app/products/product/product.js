"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Image from "next/image";

export default function Products({ products = [], searchTerm = "" }) {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const imageBaseURL = "http://127.0.0.1:8000/storage/";
  const fallbackImage = "http://127.0.0.1:8000/images/default.jpg";

  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const isAuthenticated = !!token;

  useEffect(() => {
    if (!isAuthenticated) {
      const storedFavorites = localStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } else {
      const fetchWishlist = async () => {
        try {
          const res = await fetch(
            "http://127.0.0.1:8000/api/customer/wishlist",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }
          );
          const data = await res.json();
          const ids = data.wishlist.map((item) => item.product.id);
          setFavorites(ids);
        } catch (err) {
          console.error("Fetch wishlist error:", err);
        }
      };

      fetchWishlist();
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites, isAuthenticated]);

  const toggleFavorite = async (id) => {
    if (isAuthenticated) {
      if (favorites.includes(id)) {
        try {
          await fetch(`http://127.0.0.1:8000/api/customer/wishlist/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });
          setFavorites((prev) => prev.filter((fav) => fav !== id));
        } catch (error) {
          console.error("Failed to remove from backend:", error);
        }
      } else {
        try {
          await fetch("http://127.0.0.1:8000/api/customer/wishlist", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            body: JSON.stringify({ product_id: id }),
          });
          setFavorites((prev) => [...prev, id]);
        } catch (error) {
          console.error("Failed to add to backend:", error);
        }
      }
    } else {
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
      );
    }
  };

  const handleLearnMore = (productId) => {
    router.push(`../../detailsproducts/${productId}`);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 mb-14">
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => handleLearnMore(p.id)}
              className="group relative cursor-pointer"
            >
              {/* Favorite Icon */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(p.id);
                }}
                className="absolute top-2 right-2 z-10 rounded-full p-1 transition"
              >
                {favorites.includes(p.id) ? (
                  <FaHeart className="text-red-500 text-[18px]" />
                ) : (
                  <FaRegHeart className="text-gray-700 text-[18px] hover:text-black transition" />
                )}
              </div>

              <div className="relative w-full h-[220px] md:h-[300px] overflow-hidden rounded-md">
                <Image
                  src={`${imageBaseURL}${p.image || ""}`}
                  alt={p.name || "product image"}
                  fill
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackImage;
                  }}
                  className="object-cover transition-transform duration-300 transform group-hover:scale-105"
                />
              </div>

              {/* Product Info */}
              <div className="mt-2 text-sm text-center">
                <p className="text-gray-900 font-medium line-clamp-2">
                  {p.name}
                </p>
                <p className="text-black font-semibold mt-1">${p.price}</p>
              </div>
            </div>
          ))}
        </div>
      ) : searchTerm.trim() !== "" ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-600 text-lg font-medium">
            This product was not found or doesn’t exist.
          </p>
        </div>
      ) : (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-pink-500 border-solid" />
        </div>
      )}
    </div>
  );
}
