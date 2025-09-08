"use client";

import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import AllProducts from "../products/product/product";

// Sanitize user input to prevent XSS
const sanitizeInput = (value) => {
  return value.replace(/[<>"'`$;]/g, ""); // remove dangerous characters
};

export default function SearchProducts() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    fetch("https://devflowlb.com/api/allproducts")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setNoResults(data.length === 0);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
    const safeSearch = sanitizeInput(searchTerm.trim());

    if (safeSearch === "") {
      // Re-fetch all products if search is cleared
      fetch("https://devflowlb.com/api/allproducts")
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          setNoResults(data.length === 0);
        });
      return;
    }

    fetch(
      `https://devflowlb.com/api/products?search=${encodeURIComponent(
        safeSearch
      )}`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setNoResults(data.length === 0); // true if empty
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [searchTerm]);

  return (
    <div>
      {/* Search Bar */}
      <div className="text-center mt-32">
        <TextField
          label="Search for products..."
          variant="standard"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{
            maxWidth: {
              xs: "90%",
              sm: "70%",
              md: "50%",
              lg: "40%",
            },
          }}
        />
      </div>

      {/* Conditional Text */}
      {searchTerm.trim() === "" && (
        <p className="uppercase text-black ml-5 mt-[100px] leading-6 text-base sm:text-sm sm:ml-2 sm:mt-[50px]">
          You may be interested in
        </p>
      )}

      {/* No Results Message */}
      {noResults && (
        <p className="text-center text-gray-500 mt-12 text-lg">
          No products found.
        </p>
      )}

      {/* Display Products */}
      {!noResults && (
        <div className="flex justify-center items-center mt-12">
          <AllProducts products={products} searchTerm={searchTerm} />
        </div>
      )}
    </div>
  );
}
