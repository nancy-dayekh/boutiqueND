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

  const fallbackImage = "/fallback.png"; // Add a fallback in /public

  const [token, setToken] = useState(null);
  useEffect(() => {
    setToken(localStorage.getItem("auth_token"));
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
        const sizes = (data.size?.split(" ") || []).filter((s) => s.trim() !== "");
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

    // Fetch all products
    fetch("https://devflowlb.com/api/allproducts").then((res) =>
      res.json().then(setProducts)
    );

    // Load cart and favorites from localStorage
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(savedCart.map((c) => ({ ...c, quantity: c.quantity || 1 })));
    } catch { setCart([]); }

    try {
      const savedFav = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(savedFav);
    } catch { setFavorites([]); }

    // Load reviews
    fetch(`https://devflowlb.com/api/products/${id}/reviews?limit=3`)
      .then((res) => res.json())
      .then((data) => setProduct((prev) => ({ ...prev, reviews: data.reviews || [] })));
  }, [id]);

  const images = product ? [product, ...multImages] : [];
  const numericStock = parseInt(product?.stock);
  const sizes = (product?.size?.split(" ") || []).filter((s) => s.trim() !== "");
  const isFavorite = favorites.includes(product?.id);

  const handlePrevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNextImage = () => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const toggleFavorite = async (productId) => {
    const updated = favorites.includes(productId) ? favorites.filter(f => f !== productId) : [...favorites, productId];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));

    if (token) {
      try {
        await fetch("https://devflowlb.com/api/customer/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ product_id: productId })
        });
      } catch (err) { console.error(err); }
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) { alert("Please select a size."); return; }

    const updatedCart = [...cart];
    const existing = updatedCart.find((item) => item.id === product.id && item.size === selectedSize);
    if (existing) existing.quantity += quantity;
    else updatedCart.push({ id: product.id, name: product.name, price: product.price, image: product.image, size: selectedSize, quantity });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setAlertOpen(true);
  };

  if (!product) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 font-sans text-gray-800">
      <div className="flex flex-col md:flex-row md:gap-10">
        {/* Left Column */}
        <div className="md:w-[50%] w-full">
          <div className="relative w-full sm:w-[520px]">
            <img
              src={images[currentImageIndex]?.image || fallbackImage}
              alt={product.name}
              onError={(e) => e.currentTarget.src = fallbackImage}
              className="rounded-md object-cover w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[420px]"
            />
            <button onClick={handlePrevImage} className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white transition"><FaChevronLeft /></button>
            <button onClick={handleNextImage} className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white transition"><FaChevronRight /></button>
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {images.map((img, idx) => (
              <img
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                src={img.image || fallbackImage}
                onError={(e) => e.currentTarget.src = fallbackImage}
                className={`h-16 w-16 object-cover rounded-md cursor-pointer ${idx === currentImageIndex ? "ring-2 ring-black" : "opacity-60 hover:opacity-100"} transition`}
              />
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="md:w-[50%] w-full mt-5 md:mt-0">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-xl font-semibold">{product.name}</h1>
            <button onClick={() => toggleFavorite(product.id)} className={`text-xl ${isFavorite ? "text-red-500" : "text-gray-400"}`}><FaHeart /></button>
          </div>
          <p className="text-lg font-bold mb-2">${product.price}</p>
          {numericStock <= 0 && <p className="text-sm text-red-600 mb-3">⚠️ Out of stock</p>}

          <div className="text-sm text-gray-600 mb-4">
            <p>Material: {product.meterial || "N/A"}</p>
            <p>Colors: {product.color || "N/A"}</p>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium">Quantity:</span>
            <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} disabled={quantity <= 1} className="w-8 h-8 flex items-center justify-center rounded-full border">{'-'}</button>
            <span className="w-6 text-center">{quantity}</span>
            <button onClick={() => numericStock && quantity < numericStock && setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-full border">{'+'}</button>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-1">Select Size</label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button key={size} onClick={() => setSelectedSize(size)} className={`px-7 py-2 border rounded text-sm ${selectedSize === size ? "bg-black text-white border-black" : "bg-white border-gray-300 text-gray-700 hover:ring"}`}>{size}</button>
              ))}
            </div>
          </div>

          <button onClick={handleAddToCart} disabled={numericStock <= 0} className={`w-full py-2 rounded-md font-semibold ${numericStock <= 0 ? "bg-gray-300 text-gray-600" : "bg-black text-white hover:bg-gray-900"}`}>{numericStock <= 0 ? "Out of Stock" : "Add to Cart"}</button>

          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-2">Product Description</h2>
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
