'use client';

import Link from "next/link";

export default function Logon() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Card */}
      <div className="bg-white shadow-xl w-full max-w-xl rounded-md p-10 flex flex-col gap-10">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-[18px] md:text-[22px] font-light uppercase tracking-[0.2em] text-black">
            Log in or register
          </h1>
          <p className="text-sm text-gray-600 mt-3">
            Log in to enjoy a personalised experience and access all our services.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <Link href="/login">
            <button className="w-full md:w-[200px] py-3 border border-black text-[11px] uppercase tracking-[0.15em] font-light hover:bg-black hover:text-white transition duration-300">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="w-full md:w-[200px] py-3 border border-black text-[11px] uppercase tracking-[0.15em] font-light hover:bg-black hover:text-white transition duration-300">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
