"use client";

import React, { useEffect, useState } from "react";
import Products from "../products/product/product";

export default function Favorite() {
  const [userToken, setUserToken] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Step 1: Get auth token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setUserToken(token);
  }, []);

  // Step 2: Fetch wishlist based on token or localStorage
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);

      if (userToken) {
        // ✅ Authenticated user
        try {
          const res = await fetch("http://127.0.0.1:8000/api/customer/wishlist", {
            headers: {
              Authorization: `Bearer ${userToken}`,
              Accept: "application/json",
            },
          });

          const data = await res.json();
          const products = data.wishlist.map((item) => item.product);
          setWishlist(products);
        } catch (error) {
          console.error("Error fetching user wishlist:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // ✅ Guest user
        try {
          const stored = localStorage.getItem("favorites");
          const guestFavorites = stored ? JSON.parse(stored) : [];

          // Fetch each product by ID using /api/products/{id}
          const promises = guestFavorites.map((id) =>
            fetch(`http://127.0.0.1:8000/api/products/${id}`).then((res) =>
              res.json()
            )
          );

          const results = await Promise.all(promises);
          const products = results.map((res) => res.product || res);
          setWishlist(products);
        } catch (error) {
          console.error("Error fetching guest wishlist:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWishlist();
  }, [userToken]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 pt-24 pb-8 font-sans">
      <h1 className="text-2xl font-semibold mb-6">My Favorites</h1>

      {loading ? (
        <p>Loading...</p>
      ) : wishlist.length > 0 ? (
        <Products products={wishlist} userToken={userToken} />
      ) : (
        <p className="text-gray-500">No favorite products yet.</p>
      )}
    </div>
  );
}
