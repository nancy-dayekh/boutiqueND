"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import AllProducts from "../product/product";
import { FaFilter } from "react-icons/fa";

export default function HmFilterSortCopy() {
  const [products, setProducts] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedVeil, setSelectedVeil] = useState("");
  const [sortPrice, setSortPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const params = useParams();
  const categoryName = params?.name;

  useEffect(() => {
    if (categoryName) fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    categoryName,
    priceRange,
    selectedSize,
    selectedColor,
    selectedVeil,
    sortPrice,
  ]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    const queryParams = [];

    if (selectedSize) queryParams.push(`size=${selectedSize.toLowerCase()}`);
    if (selectedColor) queryParams.push(`color=${selectedColor.toLowerCase()}`);
    if (selectedVeil)
      queryParams.push(`veil_status=${selectedVeil.toLowerCase()}`);
    if (sortPrice) queryParams.push(`sort_by=price&sort_order=${sortPrice}`);
    if (priceRange[0] !== 0 || priceRange[1] !== 200)
      queryParams.push(`min_price=${priceRange[0]}&max_price=${priceRange[1]}`);

    const query = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    const url = `http://127.0.0.1:8000/api/products/category/${categoryName}${query}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        setProducts([]);
        setError(data.message || "Failed to load products");
      } else {
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
      setError("Network error, please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"];
  const colors = [
    "Black",
    "White",
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Pink",
    "Purple",
    "Orange",
    "Brown",
    "Gray",
    "Beige",
    "Turquoise",
    "Navy",
    "Gold",
    "Silver",
    "Coral",
  ];

  const veilOptions = [
    { label: "With Veil", value: "veil" },
    { label: "Without Veil", value: "no_veil" },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 pt-6 pb-10 font-sans">
      {/* Filter + Sort Bar */}
      <div className="flex justify-between items-center mb-4 sticky top-20 z-30 px-4">
  {/* Filter Button */}
  <button
    onClick={() => setFilterOpen(true)}
    className="flex items-center justify-center gap-2 w-1/2 mr-2 border border-gray-300 rounded-xl px-3 py-2 text-sm font-medium text-gray-800 bg-white shadow-sm hover:bg-gray-100 transition"
  >
    <FaFilter className="text-gray-500" />
    Filter
  </button>

  {/* Sort Select */}
  <select
    value={sortPrice}
    onChange={(e) => setSortPrice(e.target.value)}
    className="w-1/2 ml-2 border border-gray-300 rounded-xl px-3 py-2 text-sm font-medium text-gray-800 bg-white shadow-sm hover:bg-gray-100 transition"
  >
    <option value="">Sort by</option>
    <option value="asc">Price: Low to High</option>
    <option value="desc">Price: High to Low</option>
  </select>
</div>

      {/* Loading, Error & No Results */}
      {loading && (
        <p className="text-center py-10 text-gray-700">Loading products...</p>
      )}

      {!loading && error && (
        <p className="text-center py-10 text-red-600 font-semibold">{error}</p>
      )}

      {/* Product Grid */}
      {!loading && !error && products.length > 0 && (
        <AllProducts products={products} />
      )}

      {/* Filter Panel */}
      {filterOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
          <div className="bg-white w-full sm:w-[360px] h-full p-6 overflow-y-auto transition-all duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-2">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="text-2xl font-light"
              >
                ×
              </button>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2">Price Range</h3>
              <div className="flex justify-between text-xs mb-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <Slider
                range
                min={0}
                max={200}
                value={priceRange}
                onChange={(range) => setPriceRange(range)}
                trackStyle={[{ backgroundColor: "black" }]}
                handleStyle={[
                  { backgroundColor: "black", borderColor: "black" },
                  { backgroundColor: "black", borderColor: "black" },
                ]}
                railStyle={{ backgroundColor: "#ddd" }}
              />
            </div>

            {/* Size Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <label
                    key={size}
                    className={`border px-3 py-1 rounded text-sm cursor-pointer ${
                      selectedSize === size ? "bg-black text-white" : "bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="size"
                      className="hidden"
                      checked={selectedSize === size}
                      onChange={() => setSelectedSize(size)}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <label
                    key={color}
                    className={`border px-3 py-1 rounded text-sm cursor-pointer ${
                      selectedColor === color
                        ? "bg-black text-white"
                        : "bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="color"
                      className="hidden"
                      checked={selectedColor === color}
                      onChange={() => setSelectedColor(color)}
                    />
                    {color}
                  </label>
                ))}
              </div>
            </div>

            {/* Veil Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2">Veil</h3>
              <div className="flex flex-wrap gap-2">
                {veilOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`border px-3 py-1 rounded text-sm cursor-pointer ${
                      selectedVeil === option.value
                        ? "bg-black text-white"
                        : "bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="veil"
                      className="hidden"
                      checked={selectedVeil === option.value}
                      onChange={() => setSelectedVeil(option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-4">
              <button
                onClick={() => setFilterOpen(false)}
                className="w-full bg-black text-white py-3 text-sm uppercase"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
