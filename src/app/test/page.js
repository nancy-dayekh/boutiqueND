"use client";
import { useEffect, useState } from "react";

export default function Test() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("auth_token"); // ✅ Get token
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/customer/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send token manually
          },
        });

        if (res.ok) {
          const data = await res.json();
          console.log("User data from API:", data);  // Debug: check what you get
          
          // If user data is inside a field like 'user', adjust here:
          // setUser(data.user);

          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error checking login:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (loading) return <p className="text-gray-600 p-4">Loading...</p>;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow p-6 rounded text-center max-w-md">
        {user ? (
          <>
            <h2 className="text-xl font-semibold text-green-700">
              ✅ Welcome back, {user.name || user.username || "User"}!
            </h2>
            {/* Show full user object to help debug */}
            <pre className="text-left mt-4 bg-gray-100 p-3 rounded text-sm overflow-auto max-h-48">
              {JSON.stringify(user, null, 2)}
            </pre>
          </>
        ) : (
          <h2 className="text-xl font-semibold text-red-600">
            ❌ You are not logged in.
          </h2>
        )}
      </div>
    </main>
  );
}
