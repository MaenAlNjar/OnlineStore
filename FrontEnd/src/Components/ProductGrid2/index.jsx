import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";
import { Link } from "react-router-dom";

const TAGS = {
  1: "BestSale",
  2: "TopRated",
  3: "OnSale",
  4: "Featured",
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

  useEffect(() => {
    const GetProduct = async () => {
      try {
        const response = await axios.get("https://localhost:7226/Product/all");
       

        if (response.data) {
          setProducts(response.data);
        } else {
          setError("Invalid response format. Check API structure.");
        }
      } catch (err) {
        setError("An error occurred while fetching products.");
      }
    };

    GetProduct();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));  

        if (!user || !user.id) {
          console.error("User data is missing or incorrect:", user);
        } else {
          console.log("User ID:", user.id);
        }
        
  
       
        // Pass userId as a query parameter
        const response = await axios.get(`https://localhost:7226/Wishlist/user-wishlist?userId=${user.id}`);
        setWishlist(new Set(response.data.map((item) => item.productId)));
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
      }
    };
  
    fetchWishlist();
  }, []);
  

  const toggleWishlist = async (productId) => {
    const user = JSON.parse(localStorage.getItem("user"));  
  
    if (!user || !user.id) {
      console.error("User not found.");
      return;
    }
  
    try {
      const response = await axios.get(`https://localhost:7226/Wishlist/check/${user.id}/${productId}`);
      const isInWishlist = response.data;
  
      if (isInWishlist) {
        await axios.delete(`https://localhost:7226/Wishlist/remove/${user.id}/${productId}`);
        console.log("Product removed from wishlist.");
  
        // Update the state immediately
        setWishlist((prevWishlist) => {
          const updatedWishlist = new Set(prevWishlist);
          updatedWishlist.delete(productId);
          return updatedWishlist;
        });
  
      } else {
        // Add item to wishlist
        await axios.post("https://localhost:7226/Wishlist/add", {
          userId: user.id,
          productId,
        });
        console.log("Product added to wishlist.");
  
        // Update the state immediately
        setWishlist((prevWishlist) => new Set(prevWishlist).add(productId));
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
      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={selectedTab === tab.key ? "active" : ""}
            onClick={() => setSelectedTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Product Grid */}
      <div className="grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
              <div className="text-xs text-gray-600 mb-2">{product.category}</div>
              <Link 
                to={`/auth/SinglePage/${product.id}`} 
                className="block mb-2 text-blue-600 hover:text-blue-800 text-sm font-medium text-center"
              >
                {product.name}
              </Link>
              <div className="w-32 h-32 flex justify-center items-center">
                <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="flex items-center justify-between w-full mt-4">
                <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-full transition">
                  🛒 Add to Cart
                </button>
              </div>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`mt-2 text-sm ${wishlist.has(product.id) ? "text-red-500" : "text-gray-500"} hover:text-red-600 transition`}
              >
                {wishlist.has(product.id) ? "❤️ Remove from Wishlist" : "🤍 Add to Wishlist"}
              </button>
            </div>
          ))
        ) : (
          <p>No products found in {selectedTab}.</p>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
