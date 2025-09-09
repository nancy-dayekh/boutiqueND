/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaChevronLeft, FaChevronRight, FaHeart } from "react-icons/fa";
import AllProduct from "../../products/product/product";

export default function DetailsProducts() {
  const params = useParams();
  const id = params.productsid;
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [multImages, setMultImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [token, setToken] = useState(null);

  const imageURL = (imgPath) => `https://devflowlb.com/storage/${imgPath}`;
  
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!id) return;

    // Fetch product details
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

    // Fetch multiple images
    fetch(`https://devflowlb.com/api/multiImageProducts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMultImages(data);
        else if (data?.data) setMultImages(data.data);
        else if (data?.image) setMultImages([data]);
        else setMultImages([]);
        setCurrentImageIndex(0);
      });

    // Fetch all products for "You may also like"
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
    const cartWithQuantity = savedCart.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCart(cartWithQuantity);

    // Load favorites
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch {
        setFavorites([]);
      }
    }

    // Fetch reviews
    fetch(`https://devflowlb.com/api/products/${id}/reviews?limit=3`)
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews || []));
  }, [id]);

  const images = product ? [{ image_path: product.image }, ...multImages] : [];
  const isFavorite = favorites.includes(product?.id);
  const numericStock = parseInt(product?.stock);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const toggleFavorite = async (productId) => {
    const userToken = localStorage.getItem("auth_token");
    const updatedFavorites = favorites.includes(productId)
      ? favorites.filter((fav) => fav !== productId)
      : [...favorites, productId];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    if (userToken) {
      try {
        const response = await fetch(
          "https://devflowlb.com/api/customer/wishlist",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({ product_id: productId }),
          }
        );

        if (!response.ok) console.error("Wishlist API failed");
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleAddToCart = async () => {
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

    if (token) {
      try {
        const res = await fetch(`https://devflowlb.com/api/customer/cart`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: product.id,
            quantity,
            size: selectedSize,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          alert("Error adding to cart: " + (errorData.message || "Unknown error"));
          console.error(errorData);
        }
      } catch (error) {
        console.error("Backend sync failed:", error);
      }
    }
  };

  const sizes = (product?.size?.split(" ") || []).filter((s) => s.trim() !== "");

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 font-sans">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 font-sans text-gray-800">
      <div className="flex flex-col md:flex-row md:gap-10">
        {/* Left Column */}
        <div className="md:w-[50%] w-full">
          <div className="relative w-full sm:w-[520px]">
            <img
              src={imageURL(images[currentImageIndex]?.image_path || images[currentImageIndex]?.image)}
              alt={product.name}
              onError={(e) => (e.currentTarget.src = "/fallback.png")}
              className="rounded-md object-cover w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[420px]"
            />

            <button
              onClick={handlePrevImage}
              className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white transition"
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white transition"
            >
              <FaChevronRight />
            </button>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto">
            {images.map((img, idx) => (
              <img
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                src={imageURL(img.image_path || img.image)}
                onError={(e) => (e.currentTarget.src = "/fallback.png")}
                className={`h-16 w-16 object-cover rounded-md cursor-pointer ${
                  idx === currentImageIndex ? "ring-2 ring-black" : "opacity-60 hover:opacity-100"
                } transition`}
              />
            ))}
          </div>

          {/* Reviews - Desktop */}
          <div className="mt-12 hidden md:block px-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8">Customer Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-sm">No reviews yet. Be the first to leave one!</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition-all p-6">
                    <div className="flex items-start gap-4">
                      {review.image && (
                        <img
                          src={review.image}
                          alt="Review"
                          onError={(e) => (e.currentTarget.src = "/fallback.png")}
                          className="w-28 h-28 object-cover rounded-lg border"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-md font-medium text-gray-900">{review.customer_name || "Anonymous"}</h4>
                          <span className="text-xs text-gray-400">{review.time_ago}</span>
                        </div>
                        <div className="mt-1 mb-2 text-yellow-500 text-sm">
                          {"★".repeat(review.rating)}
                          <span className="text-gray-300">{"★".repeat(5 - review.rating)}</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-10 ">
              <button
                onClick={() => router.push(`/detailsproducts/${id}/review`)}
                className="w-[200px] py-2 rounded-md font-semibold bg-black text-white hover:bg-gray-900 transition-all"
              >
                Write a Review
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:w-[50%] w-full mt-[10px] mb-5 md:mb-10">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-xl font-semibold">{product.name}</h1>
            <button onClick={() => toggleFavorite(product.id)} className={`text-xl ${isFavorite ? "text-red-500" : "text-gray-400"}`}>
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
              className={`w-8 h-8 flex items-center justify-center rounded-full border transition ${
                quantity <= 1 ? "text-gray-400 border-gray-300 cursor-not-allowed" : "text-black border-black hover:bg-black hover:text-white"
              }`}
            >
              -
            </button>
            <span className="w-6 text-center font-medium">{quantity}</span>
            <button
              onClick={() => !isNaN(numericStock) && quantity < numericStock && setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border transition text-black border-black hover:bg-black hover:text-white"
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
                    selectedSize === size ? "bg-black text-white border-black" : "bg-white border-gray-300 text-gray-700 hover:ring"
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
              isNaN(numericStock) || numericStock <= 0 ? "bg-gray-300 text-gray-600" : "bg-black text-white hover:bg-gray-900"
            }`}
          >
            {isNaN(numericStock) || numericStock <= 0 ? "Out of Stock" : "Add to Cart"}
          </button>

          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-2">Product Description</h2>
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
              {product.description || "No description available."}
            </p>
          </div>

          {/* Reviews - Mobile */}
          <div className="mt-10 md:hidden pl-[2px] pr-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Customer Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-500">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
                    {review.image && (
                      <a href={review.image} target="_blank" rel="noopener noreferrer">
                        <img
                          src={review.image}
                          alt="review"
                          onError={(e) => (e.currentTarget.src = "/fallback.png")}
                          className="w-full h-48 object-cover rounded-md mb-2"
                        />
                      </a>
                    )}
                    <div className="text-sm font-medium text-gray-900">{review.customer_name || "Anonymous"}</div>
                    <div className="text-yellow-400 text-sm">
                      {"★".repeat(review.rating)}
                      <span className="text-gray-300">{"★".repeat(5 - review.rating)}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">{review.time_ago}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => router.push(`/detailsproducts/${id}/review`)}
              className="mt-6 w-full bg-black text-white text-sm font-medium py-2 rounded-md hover:bg-gray-900 transition"
            >
              Write a Review
            </button>
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
