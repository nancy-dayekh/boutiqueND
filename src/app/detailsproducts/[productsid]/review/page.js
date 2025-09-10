"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function Review() {
  const params = useParams();
  const productId = params.productsid;

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const token = localStorage.getItem("auth_token");

    fetch(`https://devflowlb.com/api/products/${productId}/reviews`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newReview.trim() && rating === 0 && !image) return;

    const token = localStorage.getItem("auth_token");
    if (!token) {
      setShowDialog(true);
      return;
    }

    const formData = new FormData();
    formData.append("product_id", productId);
    formData.append("comment", newReview.trim());
    if (rating > 0) formData.append("rating", rating);
    if (image) formData.append("image", image);

    try {
      const res = await fetch(
        `https://devflowlb.com/api/customer/products/${productId}/reviews`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (res.ok) {
        const data = await res.json();
        setReviews((prev) => [data.review, ...prev]);
        setNewReview("");
        setRating(0);
        setImage(null);

        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = null;
      }
    } catch {
      // Fail silently
    }
  };

  return (
    <div className="mt-12 max-w-3xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Customer Reviews
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 space-y-4 bg-white p-4 rounded-md shadow-sm"
      >
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Write your review here..."
          className="w-full border border-gray-300 p-3 rounded-md text-sm"
          rows={4}
        />

        <div className="flex flex-wrap gap-2 items-center text-sm">
          <span className="text-gray-700 font-medium">Rating (optional):</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`text-2xl transition ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              aria-label={`Rate ${star}`}
            >
              ★
            </button>
          ))}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="block w-full border border-gray-200 rounded px-3 py-2 text-sm"
        />

        <button
          type="submit"
          className="w-full md:w-auto bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Submit Review
        </button>
      </form>

      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-full max-w-sm">
            <p className="text-lg font-medium text-gray-800 mb-4">
              Please log in to submit a review.
            </p>
            <button
              onClick={() => setShowDialog(false)}
              className="w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-5">
        {loading ? (
          <p className="text-center text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 p-4 rounded-md shadow-sm bg-white"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-800 text-sm md:text-base">
                  {review.customer_name || "Anonymous"}
                </span>
                <span className="text-yellow-500 text-sm md:text-base">
                  {review.rating > 0 ? `★ ${review.rating}` : null}
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-1">{review.comment}</p>

              {review.image && (
                <a
                  href={review.image}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="relative w-full h-64 mt-3 rounded-lg overflow-hidden">
                    <Image
                      src={review.image}
                      alt="Review Image"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </a>
              )}

              <p className="text-xs text-gray-400 mt-2">
                {review.time_ago ||
                  new Date(review.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
