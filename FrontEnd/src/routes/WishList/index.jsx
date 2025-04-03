import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        const response = await axios.get(
          `https://localhost:7226/Wishlist/user-wishlist?userId=${user.id}`
        );
        setWishlist(response.data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Wishlist</h2>

      {loading ? (
        <p>Loading wishlist...</p>
      ) : wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((item) => {
            if (!item.product) return null; // Skip undefined products

            return (
              <div
                key={item.productId}
                className="border p-4 rounded-md shadow"
              >
                <Link to={`/auth/SinglePage/${item.productId}`}>
                  <img
                    src={item.product.image || "placeholder.jpg"} // Use a placeholder image
                    alt={item.product.name || "No Name"}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <h3 className="text-lg font-semibold mt-2">
                    {item.product.name || "Unknown Product"}
                  </h3>
                </Link>
                <p className="text-gray-600">
                  ${item.product.price?.toFixed(2) || "0.00"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
