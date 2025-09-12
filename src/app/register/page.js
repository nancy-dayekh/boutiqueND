"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.password_confirmation)
      newErrors.password_confirmation = "Please confirm your password";
    else if (formData.password !== formData.password_confirmation)
      newErrors.password_confirmation = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");

    try {
      const res = await fetch("https://devflowlb.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.email)
          setErrors((prev) => ({ ...prev, email: data.email[0] }));
        else setServerError("Registration failed. Please check your data.");
      } else {
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          password_confirmation: "",
        });
        setShowSuccessDialog(true);
      }
    } catch {
      setServerError("Network error. Please try again later.");
    }
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen flex items-center bg-white px-4 py-10 ml-0 md:ml-28">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 text-xs tracking-widest font-light text-black mr-[10px]"
      >
        <h1 className="text-xl font-medium uppercase ">Personal details</h1>

        {serverError && (
          <p className="text-red-600 text-[10px] mb-2 text-center">
            {serverError}
          </p>
        )}

        <div className="space-y-4">
          {/* First Name */}
          <div>
            <label className="uppercase mb-1 block text-[11px]">Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full border-b border-black bg-transparent px-0 py-2 text-sm focus:outline-none focus:ring-0"
            />
            {errors.first_name && (
              <p className="text-xs text-red-600 mt-1">{errors.first_name}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="uppercase mb-1 block text-[11px]">Surname</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full border-b border-black bg-transparent px-0 py-2 text-sm focus:outline-none focus:ring-0"
            />
            {errors.last_name && (
              <p className="text-xs text-red-600 mt-1">{errors.last_name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="uppercase mb-1 block text-[11px]">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-b border-black bg-transparent px-0 py-2 text-sm focus:outline-none focus:ring-0"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="uppercase mb-1 block text-[11px]">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-b border-black bg-transparent px-0 py-2 pr-8 text-sm focus:outline-none focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-indigo-700 transition"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="uppercase mb-1 block text-[11px]">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="w-full border-b border-black bg-transparent px-0 py-2 pr-8 text-sm focus:outline-none focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-indigo-700 transition"
              >
                {showConfirm ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
              {errors.password_confirmation && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.password_confirmation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-black text-white py-3 text-sm uppercase hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Creating..." : "Create account"}
        </button>

        <p className="text-center text-[11px] mt-4">
          Already registered?{" "}
          <a href="/login" className="underline">
            Log in
          </a>
        </p>
      </form>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center shadow-lg space-y-4">
            <h3 className="text-2xl font-bold text-black">
              Account created successfully!
            </h3>
            <p className="text-gray-700">Please log in to continue.</p>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-2 rounded-md bg-black text-white font-semibold hover:bg-gray-900"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
