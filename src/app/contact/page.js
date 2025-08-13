"use client";

import { useState } from "react";

export default function ContactND() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

async function handleSendMessage(e) {
  e.preventDefault();

  if (!message.trim()) {
    setResponseMsg("Please enter a message.");
    return;
  }

  const token = localStorage.getItem("auth_token");

  // ✅ If user not logged in, show login message and skip fetch
  if (!token) {
    setResponseMsg("Please log in to send a message.");
    return;
  }

  setLoading(true);
  setResponseMsg("");

  try {
    const res = await fetch(
      "http://127.0.0.1:8000/api/customer/MessageFeedback",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // token guaranteed to exist here
        },
        body: JSON.stringify({ message }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      setResponseMsg(errorData.message || "Failed to send message.");
    } else {
      setResponseMsg("Message sent successfully!");
      setMessage("");
    }
  } catch {
    setResponseMsg("Network error. Please try again.");
  } finally {
    setLoading(false);
  }
}


  return (
    <main className="bg-white text-[#2a2a2a] m-0 p-0">
      {/* ✅ Header Video */}
      <div className="w-full px-4 sm:px-6 md:px-10 mt-[15px]">
        <div className="relative w-full h-[300px] sm:h-[330px] overflow-hidden rounded-xl shadow-lg">
          <video
            src="/video/contactuss.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-light tracking-widest uppercase">
              Contact us
            </h1>
          </div>
        </div>
      </div>

      {/* ✅ Main Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 py-14 sm:py-20">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 md:gap-20">
            {/* Left Content */}
            <div className="space-y-8 sm:space-y-10">
              {/* ... your existing left content here ... */}
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold uppercase tracking-wide">
                  Get in Touch
                </h2>
                <p className="text-sm text-[#555] leading-relaxed">
                  Questions about your order? Need help with sizing or returns?
                  We’re here to help. Contact our customer care team and we’ll
                  get back to you within 24 hours.
                </p>
              </div>

              <div className="text-sm text-[#444] space-y-2">
                <p>
                  <strong>Email:</strong> support@brandnd.com
                </p>
                <p>
                  <strong>Phone:</strong> +961 76 715 788
                </p>
                <p>
                  <strong>Hours:</strong> Mon–Sun · 8am–12pm
                </p>
                <p>
                  <strong>Location:</strong> Tyre, Lebanon
                </p>
              </div>

              {/* FAQ */}
              <div className="pt-8 sm:pt-10 space-y-6">
                <h3 className="text-base sm:text-lg font-semibold tracking-wide border-b pb-2">
                  Frequently Asked Questions
                </h3>
                {[{
                    q: "Where is my order?",
                    a: "Once your order ships, we’ll email tracking info. You can also check status in your Brand_ND account.",
                  },
                  {
                    q: "How do I return an item?",
                    a: "Use our Return Center within 14 days to generate a return label and ship it back easily.",
                  },
                  {
                    q: "Can I track my shipment?",
                    a: "Yes, via the tracking link in your confirmation email or in your account dashboard.",
                  },
                  {
                    q: "How do I use a discount code?",
                    a: "Apply it at checkout. Only one code can be used per order, and it may not apply to all items.",
                  }].map((faq, i) => (
                  <div key={i} className="border-b pb-4">
                    <h4 className="font-medium text-sm sm:text-base text-[#111] mb-1">
                      {faq.q}
                    </h4>
                    <p className="text-sm text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Form */}
            <div className="bg-[#f9f9f9] border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 shadow-md">
              <form className="space-y-6" onSubmit={handleSendMessage}>
                <h3 className="text-base sm:text-lg font-semibold">
                  Contact Our Team
                </h3>
                <p className="text-sm text-[#444]">
                  You can reach us at{" "}
                  <a
                    href="mailto:support@brandnd.com"
                    className="text-pink-600 underline"
                  >
                    support@brandnd.com
                  </a>{" "}
                  and we’ll respond within 24 hours.
                </p>

                <textarea
                  rows={6}
                  placeholder="Your message"
                  className="w-full px-4 py-3 border border-gray-300 rounded resize-none text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                />

                <button
                  type="submit"
                  className="w-full border border-black px-6 py-3 text-sm uppercase tracking-wider hover:bg-black hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !message.trim()}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>

                {responseMsg && (
                  <p
                    className={`text-sm mt-2 ${
                      responseMsg.includes("success")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {responseMsg}
                  </p>
                )}

                {/* Stay in Touch */}
                <div className="pt-8 border-t mt-8 sm:mt-10">
                  <h4 className="text-sm font-semibold mb-2 uppercase tracking-wide">
                    Stay in Touch
                  </h4>
                  <p className="text-sm text-gray-600">
                    Stay connected with <strong>Boutique ND</strong> and never miss
                    a drop — discover our{" "}
                    <strong>new collection every week</strong> exclusively
                    online.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
