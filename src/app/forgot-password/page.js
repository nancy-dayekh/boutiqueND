"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// sanitize input to prevent XSS
const sanitizeInput = (value) => {
  return value.replace(/[<>'"$]/g, "");
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // <-- حالة الرسالة
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setIsSuccess(false);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sanitizeInput(email) }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setMessage("✔️ Check your email for reset link.");
        setIsSuccess(true);
        setTimeout(() => {
          const url = new URL(data.url);
          const token = url.pathname.split("/").pop();
          const emailParam = url.searchParams.get("email");
          router.push(`/reset-password/${token}?email=${emailParam}`);
        }, 2000);
      } else if (res.status === 404 && data.error) {
        setMessage(`${data.error} Go to Register`);
        setIsSuccess(false);
      } else {
        setMessage("❌ Something went wrong. Please try again.");
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("❌ Network error. Try again.");
      setIsSuccess(false);
    }

    setSubmitting(false);
  };

  return (
    <main className="min-h-screen flex items-start bg-white pt-20 px-4 ml-0 md:ml-28">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 text-sm tracking-wide text-black"
      >
        <h1 className="text-xl font-semibold uppercase">Reset Password</h1>
        <p className="text-xs text-gray-600">
          Enter your email, and we’ll send you a password reset link.
        </p>

        <div>
          <label className="text-xs uppercase">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(sanitizeInput(e.target.value))}
            className="w-full border-b border-black py-2 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-black text-white py-3 uppercase tracking-wider hover:opacity-80 disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Continue"}
        </button>

        {message && (
          <p
            className={`text-center text-sm mt-4 ${
              isSuccess ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.includes("Go to Register") ? (
              <>
                {message.replace(" Go to Register", "")} <br />
                <a href="/register" className="underline text-blue-600">
                  Go to Register
                </a>
              </>
            ) : (
              message
            )}
          </p>
        )}
      </form>
    </main>
  );
}
