"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [customer, setCustomer] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/logon");
      return;
    }

    fetch("http://127.0.0.1:8000/api/customer/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setCustomer(data.user);
        } else {
          router.push("/logon");
        }
      })
      .catch(() => router.push("/logon"));
  }, [router]);

  const handleSignOut = async () => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      try {
        await fetch("http://127.0.0.1:8000/api/customer/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }

    localStorage.removeItem("auth_token");

    // Redirect to login page
    router.push("/logon");

    setTimeout(() => {
      window.location.reload();
    }, 200); 
  };

  if (!customer) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <p className="text-gray-400 text-lg animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 md:px-24 py-20 font-sans text-black">
      <h1 className="text-5xl font-extralight mb-16 tracking-wide">
       
      </h1>

      <section className="max-w-4xl mx-auto border-t border-gray-200 pt-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-28 gap-y-12">
          <div className="text-gray-400 uppercase text-xs tracking-widest font-semibold space-y-14">
            <p>NAME</p>
            <p>EMAIL</p>
            <p>PHONE NUMBER</p>
            <p>ADDRESS</p>
          </div>

          <div className="text-xl font-light space-y-14">
            <p>
              {customer.first_name} {customer.last_name}
            </p>
            <p>{customer.email}</p>
            <p>{customer.phone_number || "-"}</p>
            <p>{customer.address || "-"}</p>
          </div>
        </div>

        <div className="mt-24 border-t border-gray-200 pt-10">
          <button
            onClick={handleSignOut}
            className="text-red-700 uppercase font-semibold tracking-widest text-sm hover:underline focus:outline-none"
          >
            Sign out
          </button>
        </div>
      </section>
    </main>
  );
}
