/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from "react"; // ✅ added useCallback
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ShoppingCart() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    setIsClient(true);

    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken);
      fetchCartFromBackend(storedToken);
    } else {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(
        localCart.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
        }))
      );
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn && isClient) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isLoggedIn, isClient]);

  const fetchCartFromBackend = async (userToken) => {
    try {
      const res = await fetch("https://devflowlb.com/api/customer/cart", {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      const backendCart = data.cart_items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        image: item.product.image,
        price: parseFloat(item.product.price),
        quantity: item.quantity,
        size: item.size || "",
        cart_id: item.id,
      }));

      setCart(backendCart);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const fetchQuantities = useCallback(async () => {
    const newQuantities = {};
    await Promise.all(
      cart.map(async (item) => {
        try {
          const res = await fetch(
            `https://devflowlb.com/api/products/${item.id}`
          );
          const data = await res.json();
          newQuantities[item.id] = parseInt(data.stock) || 1;
        } catch {
          newQuantities[item.id] = 1;
        }
      })
    );
    setQuantities(newQuantities);
  }, [cart]);

  useEffect(() => {
    if (cart.length > 0 && isClient) {
      fetchQuantities();
    }
  }, [cart, isClient, fetchQuantities]);

  const handleBackToShop = () => router.push("/products");
  const handleCheckouts = () => router.push("/checkouts");

  const handleIncrease = (itemId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId && item.quantity < (quantities[itemId] || 1)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecrease = (itemId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemoveItem = async (item) => {
    if (isLoggedIn) {
      try {
        await fetch(`https://devflowlb.com/api/customer/cart/${item.cart_id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      } catch (err) {
        console.error("Delete failed", err);
      }
    }

    const updatedCart = cart.filter((c) =>
      isLoggedIn ? c.cart_id !== item.cart_id : c.id !== item.id
    );
    setCart(updatedCart);
    setDialogOpen(false);
  };

  const calculateTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-xl p-6 sm:p-8">
        <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 mb-6">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500 text-base py-16">
            Your cart is empty.
          </p>
        ) : (
          <>
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={isLoggedIn ? item.cart_id : item.id}
                  className="flex flex-col sm:flex-row items-center sm:items-start border-b border-gray-200 pb-5"
                >
                  <Image
                    src={item.image || "/placeholder.png"} // fallback image
                    alt={item.name}
                    width={128}
                    height={128}
                    className="rounded-lg object-cover shadow-sm"
                  />

                  <div className="flex flex-col sm:ml-6 flex-1 w-full mt-4 sm:mt-0">
                    <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {item.name}
                    </h2>
                    <p className="mt-1 text-gray-600 text-sm">
                      Size: <span className="font-medium">{item.size}</span>
                    </p>
                    <p className="mt-1 text-gray-900 font-bold text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleDecrease(item.id)}
                        disabled={item.quantity <= 1}
                        className={`w-10 h-10 flex justify-center items-center rounded-full border text-xl font-bold transition-colors ${
                          item.quantity <= 1
                            ? "text-gray-300 border-gray-300 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-900 hover:text-white"
                        }`}
                      >
                        −
                      </button>
                      <span className="text-lg font-medium w-10 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrease(item.id)}
                        disabled={
                          quantities[item.id] &&
                          item.quantity >= quantities[item.id]
                        }
                        className={`w-10 h-10 flex justify-center items-center rounded-full border text-xl font-bold transition-colors ${
                          quantities[item.id] &&
                          item.quantity >= quantities[item.id]
                            ? "text-gray-300 border-gray-300 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-900 hover:text-white"
                        }`}
                      >
                        +
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete(item);
                          setDialogOpen(true);
                        }}
                        className="ml-auto text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t pt-6">
              <div className="text-lg font-semibold text-gray-900">
                Total: ${calculateTotalPrice()}
              </div>
              <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 w-full sm:w-auto">
                <button
                  onClick={handleBackToShop}
                  className="w-full sm:w-auto px-6 py-3 border text-gray-700 rounded-md hover:bg-gray-700 hover:text-white"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleCheckouts}
                  className="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-900"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">Remove Item</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to remove this item from your cart?
            </p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => {
                  setDialogOpen(false);
                  setItemToDelete(null);
                }}
                className="px-5 py-2 rounded border text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveItem(itemToDelete)}
                className="px-5 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
