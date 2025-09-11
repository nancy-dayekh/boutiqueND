"use client";

import Link from "next/link";
import { FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import Image from "next/image";

const socialLinks = [
  {
    Icon: FaInstagram,
    url: "https://instagram.com/boutiqueND", // ✅ محدث بالرابط الصحيح
    title: "Instagram",
  },
  {
    Icon: FaWhatsapp,
    url: "https://wa.me/96176715788",
    title: "WhatsApp",
  },
  {
    Icon: FaEnvelope,
    url: "mailto:boutiquend@devflowlb.com",
    title: "Email",
  },
];

const shopItems = [
  "Dresses",
  "Jeans",
  "Set",
  "T-Shirts",
  "Denim Jeans",
  "Blazer",
  "Skirt",
  "Vest",
];

const careItems = ["Add to Cart", "About Us", "Contact Us"];

export default function Footer() {
  return (
    <footer className="bg-black text-white font-sans text-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* Brand Info */}
<div>
  <Image
    src="/image/footorlogo.png"
    alt="Logo"
    width={130}
    height={60}
    priority
  />
  <p className="text-gray-400 leading-relaxed mt-5">
    Discover elegance & confidence with every piece. <br />
    New arrivals weekly. Designed for the bold & beautiful.
  </p>
</div>


        {/* Shop - 2 Columns */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wide">
            Shop
          </h3>
          <div className="grid grid-cols-2 gap-3 text-gray-400">
            {shopItems.map((item) => (
              <Link
                key={item}
                href={`/products/${encodeURIComponent(
                  item.toLowerCase().replace(/\s+/g, "-")
                )}`}
                className="hover:text-gray-200 transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Customer Care */}
        {/* Customer Care */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wide">
            Customer Care
          </h3>
          <ul className="space-y-3 text-gray-400">
            <li>
              <Link
                href="/addtocarts"
                className="hover:text-gray-200 transition-colors duration-200"
              >
                Add to Cart
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-gray-200 transition-colors duration-200"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-gray-200 transition-colors duration-200"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Social + Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wide">
            Connect With Us
          </h3>
          <p className="text-gray-400 mb-4 leading-relaxed">
            <br />
            +961 76 715 788
          </p>
          <div className="flex gap-5">
            {socialLinks.map(({ Icon, url, title }, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title={title}
                aria-label={title}
                className="text-gray-400 hover:text-gray-200 transition duration-300"
              >
                <Icon size={22} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 text-center py-5 text-gray-500 text-xs">
        © {new Date().getFullYear()} Boutique ND. All rights reserved. |{" "}
        <Link href="/privacy" className="hover:text-gray-200">
          Privacy Policy
        </Link>{" "}
        |{" "}
        <Link href="/terms" className="hover:text-gray-200">
          Terms of Use
        </Link>
      </div>
    </footer>
  );
}
