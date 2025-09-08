"use client";
import { useState, useEffect } from "react";
import {
  FaBars,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaHeart,
  FaTimes,
} from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [categoryItems, setCategoryItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      fetch("https://devflowlb.com/api/customer/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.user && data.user.first_name) {
            setCustomerName(data.user.first_name); // only first name
            // OR full name:
            // setCustomerName(`${data.user.first_name} ${data.user.last_name}`);
          }
        })
        .catch((err) => console.error("Error fetching customer info:", err));
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://devflowlb.com/api/categories");
        const data = await response.json();
        if (data.success && data.data) {
          setCategoryItems(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);
  const toggleProductsDropdown = () => setProductsDropdownOpen((prev) => !prev);

  const handleSearch = () => {
    if (query.trim()) {
      setProductsDropdownOpen(false);
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 shadow-sm h-20 md:h-24">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-5">
          {/* Mobile Header */}
          <div className="flex items-center md:hidden w-full h-20">
            {/* Menu button and Logo stuck together */}
            <div className="flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="text-black text-2xl p-0 m-0"
              >
                {mobileOpen ? <FaTimes /> : <FaBars />}
              </button>

              <Image
                src="/image/logond.png"
                alt="Logo"
                width={100}
                height={40}
                priority
                className="block m-0"
              />
            </div>

            {/* Icons aligned to the end */}
            <div className="flex items-center gap-2 text-black ml-auto">
              <Link href={customerName ? "/profile" : "/logon"}>
                {customerName ? (
                  <span className="font-semibold hover:text-pink-500 cursor-pointer">
                    {customerName}
                  </span>
                ) : (
                  <FaUser className="hover:text-pink-500 cursor-pointer" />
                )}
              </Link>
              <Link
                href="/search"
                className="hover:text-pink-500 transition-colors"
              >
                <FaSearch className="text-[20px]" />
              </Link>
              <Link
                href="/favorite"
                className="hover:text-pink-500 transition-colors"
              >
                <FaHeart className="text-[20px]" />
              </Link>
              <Link
                href="/addtocarts"
                className="hover:text-pink-500 transition-colors"
              >
                <FaShoppingCart className="text-[20px]" />
              </Link>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center w-full">
            <div className="flex items-center gap-0">
              <Image
                src="/image/logond.png"
                alt="Logo"
                width={100}
                height={40}
                priority
                className="block"
              />
            </div>

            {/* Search */}
            <div
              className="relative w-full max-w-[500px] mx-8"
              onMouseEnter={() => setSearchDropdownOpen(true)}
              onMouseLeave={() => setSearchDropdownOpen(false)}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search our store"
                className="w-full pl-5 pr-12 py-2.5 rounded-full border border-gray-300 outline-none shadow-sm transition-all duration-200"
                onFocus={() => setSearchDropdownOpen(true)}
                onBlur={() => setSearchDropdownOpen(false)}
              />
              <button
                onClick={() => {
                  handleSearch();
                  setSearchDropdownOpen(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-500"
              >
                <FaSearch className="text-lg" />
              </button>

              {searchDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white/95 shadow-lg rounded-md p-5 grid grid-cols-2 gap-6 min-w-[320px] max-h-[260px] overflow-y-auto z-50">
                  {categoryItems.length === 0 ? (
                    <p className="text-gray-500 col-span-2">No categories.</p>
                  ) : (
                    categoryItems.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products/${cat.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="text-gray-800 hover:text-pink-500"
                        onClick={() => setSearchDropdownOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 text-black">
              <Link href={customerName ? "/profile" : "/logon"}>
                {customerName ? (
                  <span className="font-semibold hover:text-pink-500 cursor-pointer">
                    {customerName}
                  </span>
                ) : (
                  <FaUser className="hover:text-pink-500 cursor-pointer" />
                )}
              </Link>
              <Link href="/favorite">
                <FaHeart className="hover:text-pink-500" />
              </Link>
              <Link href="/addtocarts">
                <FaShoppingCart className="hover:text-pink-500" />
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex justify-center items-center gap-6 px-5 h-14 bg-black">
          <Link href="/" className="text-white px-4 py-2 hover:bg-[#5f4c4c]">
            Home
          </Link>
          <div
            onMouseEnter={() => setProductsDropdownOpen(true)}
            onMouseLeave={() => setProductsDropdownOpen(false)}
            className="relative group text-white px-4 py-2 hover:bg-[#5f4c4c] cursor-pointer"
          >
            <Link href="/products"> Products</Link>
            {productsDropdownOpen && (
              <div className="absolute top-12 left-0 bg-white/95 shadow-lg rounded-md p-5 grid grid-cols-2 gap-6 min-w-[320px] z-50">
                {categoryItems.length === 0 ? (
                  <p className="text-gray-500 col-span-2">No categories.</p>
                ) : (
                  categoryItems.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products/${cat.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="text-gray-800 hover:text-pink-500"
                      onClick={() => setProductsDropdownOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          <Link
            href="/NewCollection"
            className="text-white px-4 py-2 hover:bg-[#5f4c4c]"
          >
            New Collection
          </Link>
          <Link
            href="/about"
            className="text-white px-4 py-2 hover:bg-[#5f4c4c]"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-white px-4 py-2 hover:bg-[#5f4c4c]"
          >
            Contact
          </Link>
        </nav>
      </header>

      {/* Mobile Overlay */}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-5 h-20 border-b">
            <h1 className="text-[17px] font-bold text-black">Menu</h1>
            <button onClick={toggleMobileMenu} className="text-2xl text-black">
              <FaTimes />
            </button>
          </div>

          {/* Menu Links */}
          <nav className="flex-grow overflow-y-auto divide-y divide-gray-200 text-gray-900">
            <Link
              href="/"
              onClick={toggleMobileMenu}
              className="flex items-center gap-3 px-6 py-5 text-[17px] font-semibold hover:text-[#ff4d6d] transition-all duration-300"
            >
              Home
            </Link>

            {/* Products with dropdown */}
            <div className="px-6 py-5">
              <button
                onClick={toggleProductsDropdown}
                className="flex items-center justify-between w-full text-[17px] font-semibold hover:text-[#ff4d6d]"
              >
                <span>Products</span>
                <svg
                  className={`w-5 h-5 ml-2 transition-transform ${
                    productsDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {productsDropdownOpen && (
                <ul className="mt-2 ml-4 pl-4 border-l max-h-60 overflow-y-auto space-y-2">
                  {categoryItems.length === 0 ? (
                    <li className="text-gray-500">No categories.</li>
                  ) : (
                    categoryItems.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          href={`/products/${cat.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="block text-sm hover:text-pink-500"
                          onClick={() => {
                            toggleMobileMenu();
                            setProductsDropdownOpen(false);
                          }}
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>

            <Link
              href="/NewCollection"
              onClick={toggleMobileMenu}
              className="flex items-center gap-3 px-6 py-5 text-[17px] font-semibold hover:text-[#ff4d6d]"
            >
              New Collection
            </Link>
            <Link
              href="/about"
              onClick={toggleMobileMenu}
              className="flex items-center gap-3 px-6 py-5 text-[17px] font-semibold hover:text-[#ff4d6d]"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={toggleMobileMenu}
              className="flex items-center gap-3 px-6 py-5 text-[17px] font-semibold hover:text-[#ff4d6d]"
            >
              Contact
            </Link>

            {/* Sign In */}
            <Link
              href="/login"
              onClick={toggleMobileMenu}
              className="flex items-center gap-3 px-6 py-5 text-[16px] font-normal text-gray-700 hover:text-[#ff4d6d]"
            >
              <FaUser className="text-lg" />
              Sign In
            </Link>

            {/* Register */}
            <Link
              href="/register"
              onClick={toggleMobileMenu}
              className="flex items-center gap-3 px-6 py-5 text-[16px] font-normal text-gray-700 hover:text-[#ff4d6d]"
            >
              <FaUser className="text-lg" />
              Create an Account
            </Link>

            {/* Wishlist */}
            <Link
              href="/favorite"
              onClick={toggleMobileMenu}
              className="flex items-center gap-3 px-6 py-5 text-[16px] font-normal text-gray-700 hover:text-[#ff4d6d]"
            >
              <FaHeart className="text-lg" />
              My Wishlist
            </Link>
          </nav>
        </div>
      </aside>

      <div className="mt-20 md:mt-[12%]" />
    </>
  );
}
