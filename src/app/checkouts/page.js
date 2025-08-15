"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "+961",
    city: "",
  });
  const [shipping, setShipping] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // to track if user is logged in and form should be readonly

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Fetch shipping info
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/nbdelivery")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setShipping(data[0]);
      })
      .catch(() => {});
  }, []);

  // Fetch logged-in user info to pre-fill form and disable editing
  // Fetch user data and cart using token
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // Fetch user data
    fetch("http://127.0.0.1:8000/api/customer/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setIsUserLoggedIn(true);
          setFormData({
            firstName: data.user.first_name || "",
            lastName: data.user.last_name || "",
            address: data.user.address || "",
            phone: "+961",
            city: data.user.city || "",
          });
          setSelectedCountry(data.user.country || "Lebanon");
        }
      })
      .catch(() => {
        setIsUserLoggedIn(false);
      });

    // ✅ Fetch cart from /api/customer/cart
    fetch("http://127.0.0.1:8000/api/customer/cart", { headers })
      .then((res) => res.json())
      .then((data) => {
        if (data.cart_items) {
          const formatted = data.cart_items.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            image: item.product.image,
            price: item.product.price,
            quantity: item.quantity,
            size: item.size,
          }));
          setCart(formatted);
        }
      })
      .catch(() => {
        console.error("Failed to fetch customer cart");
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (isUserLoggedIn) {
      // Allow only address, city, and phone fields to be editable
      if (!["address", "city", "phone"].includes(name)) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = (e) => {
    if (isUserLoggedIn) return; // prevent changes if user data loaded and form is readonly
    setSelectedCountry(e.target.value);
  };

  const calculateSubtotal = () => {
    return cart
      .reduce(
        (total, item) => total + parseFloat(item.price) * item.quantity,
        0
      )
      .toFixed(2);
  };

  const calculateShipping = () => {
    return shipping.salary ? parseFloat(shipping.salary).toFixed(0) : "4";
  };

  const calculateTotal = () => {
    return (
      parseFloat(calculateSubtotal()) + parseFloat(calculateShipping())
    ).toFixed(2);
  };

  const handleSubmit = async () => {
    if (cart.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.address.trim() ||
      !formData.phone.trim() ||
      !formData.city.trim() ||
      !selectedCountry.trim()
    ) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("auth_token");
      const isLoggedIn = !!token;

      const headers = {
        "Content-Type": "application/json",
        ...(isLoggedIn && { Authorization: `Bearer ${token}` }),
      };

      // 🟢 Use guest or customer endpoint
      const shipmentUrl = isLoggedIn
        ? "http://127.0.0.1:8000/api/customer/shipments"
        : "http://127.0.0.1:8000/api/guest/shipments";

      const shipmentRes = await fetch(shipmentUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          shipment_date: new Date().toISOString().slice(0, 10),
          address: formData.address,
          city: formData.city,
          state: "Beirut",
          first_name: formData.firstName,
          last_name: formData.lastName,
          country: selectedCountry || "Lebanon",
        }),
      });

      const shipmentData = await shipmentRes.json();
      if (!shipmentRes.ok) throw new Error("Shipment failed");

      const paymentUrl = isLoggedIn
        ? "http://127.0.0.1:8000/api/customer/payments"
        : "http://127.0.0.1:8000/api/guest/payments";

      const paymentRes = await fetch(paymentUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          payment_date: new Date().toISOString().slice(0, 10),
          payment_method: "Cash on Delivery",
          amount: parseFloat(calculateTotal()),
        }),
      });

      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) throw new Error("Payment failed");

      const orderUrl = isLoggedIn
        ? "http://127.0.0.1:8000/api/customer/orders"
        : "http://127.0.0.1:8000/api/guest/orders";

      const orderRes = await fetch(orderUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          order_date: new Date().toISOString().slice(0, 10),
          total_price: parseFloat(calculateTotal()),
          shipment_id: shipmentData.shipment?.id,
          payment_id: paymentData.payment?.id,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error("Order failed");

      const orderItemUrl = isLoggedIn
        ? "http://127.0.0.1:8000/api/customer/order-items"
        : "http://127.0.0.1:8000/api/guest/order-items";

      for (const item of cart) {
        const res = await fetch(orderItemUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            quantity: item.quantity,
            price: parseFloat(item.price),
            product_id: item.id,
            order_id: orderData.order?.id,
            size: item.size || null,
          }),
        });
        if (!res.ok) throw new Error("Order item failed");
      }

      // نمسح الـ cart في الـ backend بعد تأكيد إضافة الـ order items
      if (isLoggedIn) {
        await fetch("http://127.0.0.1:8000/api/customer/cart/clear", {
          method: "POST",
          headers,
        });
      }

      setSuccessMsg("Your order has been placed successfully!");
      localStorage.removeItem("cart");
      setCart([]);

      setSuccessMsg("Your order has been placed successfully!");
      localStorage.removeItem("cart");
      setCart([]);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (error) {
      console.error("Checkout error:", error);
      setErrorMsg("Something went wrong during checkout.");
    } finally {
      setIsLoading(false);
    }
  };

  // For readonly inputs with gray background if logged in
  const inputClass = (readonly) =>
    `border rounded-md px-4 py-3 w-full focus:ring-2 ${
      readonly
        ? "bg-gray-200 cursor-not-allowed border-gray-400"
        : "border-gray-300 focus:ring-black"
    }`;

  return (
    <div className="bg-[#f6f6f6] py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Left - Shipping Form */}
        <div className="lg:w-2/3 bg-transparent lg:bg-white p-0 lg:p-8 rounded-none lg:rounded-lg shadow-none lg:shadow-md border-none lg:border">
          <h2 className="text-3xl font-semibold mb-6">Shipping Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className={inputClass(isUserLoggedIn)}
              readOnly={isUserLoggedIn}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className={inputClass(isUserLoggedIn)}
              readOnly={isUserLoggedIn}
            />
          </div>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-4 py-3 mb-4 w-full focus:ring-2 focus:ring-black"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-4 py-3 w-full focus:ring-2 focus:ring-black"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-4 py-3 w-full focus:ring-2 focus:ring-black"
            />
          </div>
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className={inputClass(isUserLoggedIn)}
            disabled={isUserLoggedIn}
          >
            <option value="" disabled>
              Country / Region
            </option>
            <option value="Lebanon">Lebanon</option>
          </select>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Shipping Method</h3>
            <div className="rounded-md px-4 py-3 bg-gray-50 flex justify-between">
              <span>Cash On Delivery</span>
              <span>${calculateShipping()}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Payment</h3>
            <input
              type="text"
              value="Cash on Delivery (COD)"
              readOnly
              disabled
              className="w-full border border-gray-300 rounded-md px-4 py-3 bg-gray-100"
            />
          </div>
        </div>

        {/* Right - Order Summary */}
        <div className="lg:w-1/3 bg-transparent lg:bg-white p-0 lg:p-6 rounded-none lg:rounded-lg shadow-none lg:shadow-md border-none lg:border">
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

          {cart.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center mb-4 border-b pb-3"
              >
       <div className="w-16 h-16 relative">
  <Image
    src={`http://127.0.0.1:8000/storage/${item.image}`}
    alt={item.name}
    fill
    className="object-cover rounded"
  />
</div>


                <div className="flex justify-between w-full">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-sm font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}

          <div className="flex justify-between mt-6 text-base">
            <span className="font-medium">Subtotal</span>
            <span>${calculateSubtotal()}</span>
          </div>
          <div className="flex justify-between text-base mb-2">
            <span className="font-medium">Shipping</span>
            <span>${calculateShipping()}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-4 mt-4">
            <span>Total</span>
            <span>${calculateTotal()}</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-900"
            } text-white font-semibold py-3 rounded-md mt-6 transition duration-300`}
          >
            {isLoading ? "Processing..." : "Complete Order"}
          </button>

          {successMsg && (
            <p className="mt-4 text-green-600 font-medium text-center">
              {successMsg}
            </p>
          )}
          {errorMsg && (
            <p className="mt-4 text-red-600 font-medium text-center">
              {errorMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
