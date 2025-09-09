/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaHeart } from "react-icons/fa";
import AllProduct from "../../products/product/product";

export default function DetailsProducts() {
  const params = useParams();
  const id = params.productsid;
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);

  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!id) return;

    // Fetch product
    fetch(`https://devflowlb.com/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);

        const numericStock = parseInt(data.stock);
        setQuantity(!isNaN(numericStock) && numericStock > 0 ? 1 : 0);

        const sizes = (data.size?.split(" ") || []).filter(
          (s) => s.trim() !== ""
        );
        setSelectedSize(sizes[0] || "");
      });

    // Fetch all products for recommendations
    fetch("https://devflowlb.com/api/allproducts")
      .then((res) => res.json())
      .then(setProducts);

    // Load cart from localStorage
    const rawCart = localStorage.getItem("cart");
    let savedCart = [];
    try {
      const parsed = JSON.parse(rawCart);
      savedCart = Array.isArray(parsed) ? parsed : [];
    } catch {
      savedCart = [];
    }
    setCart(savedCart);

    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch {
        setFavorites([]);
      }
    }
  }, [id]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 font-sans">
        Loading product details...
      </div>
    );
  }

  const sizes = (product?.size?.split(" ") || []).filter((s) => s.trim() !== "");
  const numericStock = parseInt(product?.stock);
  const isFavorite = favorites.includes(product?.id);

  const toggleFavorite = (productId) => {
    const updatedFavorites = favorites.includes(productId)
      ? favorites.filter((fav) => fav !== productId)
      : [...favorites, productId];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    const updatedCart = [...cart];
    const existingIndex = updatedCart.findIndex(
      (item) => item.id === product.id && item.size === selectedSize
    );

    if (existingIndex !== -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({
        id: product.id,
        name: product.name,
        quantity,
        price: product.price,
        image: product.image,
        size: selectedSize,
      });
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    setAlertOpen(true);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 font-sans text-gray-800">
      <div className="flex flex-col md:flex-row md:gap-10">
        {/* Left Column */}
        <div className="md:w-[50%] w-full">
          <img
            src={product.image}
            alt={product.name}
            className="rounded-md object-cover w-full h-[400px]"
          />
        </div>

        {/* Right Column */}
        <div className="md:w-[50%] w-full mt-5 md:mt-0">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-xl font-semibold">{product.name}</h1>
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`text-xl ${isFavorite ? "text-red-500" : "text-gray-400"}`}
            >
              <FaHeart />
            </button>
          </div>

          <p className="text-lg font-bold mb-2">${product.price}</p>
          {isNaN(numericStock) || numericStock <= 0 ? (
            <p className="text-sm text-red-600 mb-3">⚠️ Out of stock</p>
          ) : null}

          <div className="text-sm text-gray-600 mb-4">
            <p>Material: {product.meterial || "N/A"}</p>
            <p>Colors: {product.color || "N/A"}</p>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium">Quantity:</span>

            <button
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-full border text-black hover:bg-black hover:text-white disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
            >
              -
            </button>

            <span className="w-6 text-center font-medium">{quantity}</span>

            <button
              onClick={() =>
                !isNaN(numericStock) &&
                quantity < numericStock &&
                setQuantity(quantity + 1)
              }
              className="w-8 h-8 flex items-center justify-center rounded-full border text-black hover:bg-black hover:text-white"
            >
              +
            </button>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-1">Select Size</label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-7 py-2 border rounded text-sm ${
                    selectedSize === size
                      ? "bg-black text-white border-black"
                      : "bg-white border-gray-300 text-gray-700 hover:ring"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isNaN(numericStock) || numericStock <= 0}
            className={`w-full py-2 rounded-md font-semibold ${
              isNaN(numericStock) || numericStock <= 0
                ? "bg-gray-300 text-gray-600"
                : "bg-black text-white hover:bg-gray-900"
            }`}
          >
            {isNaN(numericStock) || numericStock <= 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>

          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-2">Product Description</h2>
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
              {product.description || "No description available."}
            </p>
          </div>
        </div>
      </div>

      {/* You may also like */}
      <h2 className="text-lg font-semibold uppercase mt-20 mb-6">You may also like</h2>
      <div className="flex flex-wrap justify-center gap-4">
        <AllProduct products={products} />
      </div>

      {alertOpen && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50">
          Item added to cart successfully!
          <button
            onClick={() => setAlertOpen(false)}
            className="ml-4 font-bold hover:text-green-200"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
