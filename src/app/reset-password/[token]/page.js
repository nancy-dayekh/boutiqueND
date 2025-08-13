"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function ResetPasswordPage({ params }) {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = params.token; // token from URL path
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/customer/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            token,
            password,
            password_confirmation: confirmPassword,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Password reset successfully.");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setMessage("❌ " + (data.error || "Reset failed."));
      }
    } catch (error) {
      setMessage("❌ Network error.");
      console.error(error);
    }

    setSubmitting(false);
  };

  return (
    <main className="min-h-screen flex items-start bg-white pt-20 px-4 ml-0 md:ml-28">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 text-sm tracking-wide text-black"
      >
        <h1 className="text-xl font-semibold uppercase">Set New Password</h1>
        <p className="text-xs text-gray-600">
          Reset password for <strong>{email}</strong>
        </p>

        <div className="relative">
          <label className="text-xs uppercase">New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-black py-2 pr-10 focus:outline-none"
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-8 cursor-pointer"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-600" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-600" />
            )}
          </div>
        </div>

        <div className="relative">
          <label className="text-xs uppercase">Confirm Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border-b border-black py-2 pr-10 focus:outline-none"
          />
          <div
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-2 top-8 cursor-pointer"
          >
            {showConfirm ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-600" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-600" />
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-black text-white py-3 uppercase tracking-wider hover:opacity-80 disabled:opacity-50"
        >
          {submitting ? "Resetting..." : "Reset Password"}
        </button>

        {message && (
          <p
            className={`text-center mt-4 ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
