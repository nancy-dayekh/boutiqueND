/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, Suspense } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ must be first
  const success = searchParams.get("success");

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      const res = await fetch("https://devflowlb.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("auth_token", data.token);
        setShowSuccessDialog(true);
        setTimeout(() => {
          setShowSuccessDialog(false);
          router.push("/");
        }, 2000);
      } else {
        setErrors({ form: data.message || "Invalid credentials." });
      }
    } catch {
      setErrors({ form: "Network error. Please try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-start bg-white pt-20 px-4 ml-0 md:ml-28">
      {showSuccessDialog && (
        <div className="absolute top-5 right-5 bg-green-100 text-green-800 px-4 py-3 rounded shadow-lg animate-fade-in">
          ✅ Login successful! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-light uppercase text-black tracking-wide">
          Log in
        </h1>

        {success === "1" && (
          <p className="text-sm text-green-600 text-center">
            Account created successfully. Please log in.
          </p>
        )}

        {errors.form && (
          <p className="text-sm text-red-600 text-center">{errors.form}</p>
        )}

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border-b px-1 py-3 text-sm placeholder:text-gray-500 bg-transparent focus:outline-none ${
              errors.email ? "border-red-600" : "border-black"
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full border-b px-1 py-3 pr-10 text-sm placeholder:text-gray-500 bg-transparent focus:outline-none ${
              errors.password ? "border-red-600" : "border-black"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-xs text-gray-600 hover:underline"
          >
            Forgot your password?
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full border border-black py-3 text-sm uppercase tracking-wide transition duration-300 ${
            submitting ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "hover:bg-black hover:text-white"
          }`}
        >
          {submitting ? "Logging in..." : "Log In"}
        </button>
      </form>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
