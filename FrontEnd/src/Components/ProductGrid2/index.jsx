import React, { useEffect, useState } from "react";
import "./index.css";
import { Link } from "react-router-dom";
import apiRequest from "../../lip/apiReq";

const TAGS = {
  1: "BestSale",
  2: "TopRated",
  3: "OnSale",
  0: "Featured",
};

const TABS = [
  { key: "Featured", label: "Featured" },
  { key: "OnSale", label: "On Sale" },
  { key: "TopRated", label: "Top Rated" },
  { key: "BestSale", label: "Best Sale" },
];

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [selectedTab, setSelectedTab] = useState("Featured");
  const [error, setError] = useState(null);
  const [wishlistLoaded, setWishlistLoaded] = useState(false);

  useEffect(() => {
    const GetProduct = async () => {
      try {
        const response = await apiRequest.get("products/all");
        setProducts(response.data || []);
      } catch (err) {
        setError("An error occurred while fetching products.");
      }
    };

    GetProduct();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const userRaw = localStorage.getItem("user");
        if (!userRaw) throw new Error("No user in localStorage");

        const user = JSON.parse(userRaw);
        if (!user._id) throw new Error("User ID missing");

        const response = await apiRequest.get(
          `wishlist/user-wishlist?userId=${user._id}`
        );

        const productIds = response.data.map(
          (item) => item.productId?._id || item.productId
        );

        setWishlist(new Set(productIds));
        localStorage.setItem("wishlist", JSON.stringify(productIds));
      } catch (err) {
        console.error("Failed to fetch wishlist", err);

        const cached = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlist(new Set(cached));
      } finally {
        setWishlistLoaded(true);
      }
    };

    fetchWishlist();
  }, []);

  const toggleWishlist = async (productId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return;

    try {
      const response = await apiRequest.get(
        `wishlist/check/${user._id}/${productId}`
      );
      const isInWishlist = response.data.exists;

      if (isInWishlist) {
        await apiRequest.delete(`wishlist/remove/${user._id}/${productId}`);
        setWishlist((prev) => {
          const updated = new Set(prev);
          updated.delete(productId);
          return updated;
        });
      } else {
        await apiRequest.post("wishlist/add", {
          userId: user._id,
          productId,
        });
        setWishlist((prev) => new Set(prev).add(productId));
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
    }
  };

  const filteredProducts = products.filter(
    (product) => TAGS[Number(product.tag)] === selectedTab
  );

  return (
    <div className="containes">
      <div className="tabs flex gap-4 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              selectedTab === tab.key
                ? "bg-black text-white"
                : "bg-white text-black border-gray-300"
            } transition`}
            onClick={() => setSelectedTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {!wishlistLoaded ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
              >
                <div className="text-xs text-gray-600 mb-2">
                  {product.category}
                </div>
                <Link
                  to={`/auth/SinglePage/${product._id}`}
                  className="block mb-2 text-blue-600 hover:text-blue-800 text-sm font-medium text-center"
                >
                  {product.name}
                </Link>
                <div className="w-32 h-32 flex justify-center items-center mb-4">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between w-full mt-auto">
                  <span className="text-lg font-semibold">
                    ${product.price.toFixed(2)}
                  </span>
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded-full text-sm transition">
                    🛒 Add to Cart
                  </button>
                </div>
                <button
                  onClick={() => toggleWishlist(product._id)}
                  className={`mt-2 text-base ${
                    wishlist.has(product._id)
                      ? "text-red-500"
                      : "text-gray-400 hover:text-red-500"
                  } transition`}
                  title="Toggle Wishlist"
                >
                  {wishlist.has(product._id) ? "❤️" : "🤍"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center col-span-4 text-gray-600">
              No products found in <strong>{selectedTab}</strong>.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
