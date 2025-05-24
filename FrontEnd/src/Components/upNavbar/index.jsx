import React, { useState, useEffect } from "react";
import { ChevronDown, Heart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TopNavbar = () => {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // React Router navigation

  // Check user login status from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user"); // Change key based on your auth system
    setIsLoggedIn(!!user);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user token from storage
    setIsLoggedIn(false);
    window.location.reload(); // Refresh to reflect UI changes
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex space-x-8">
            <a href="/blog" className="text-gray-600 hover:text-gray-900">
              Blog
            </a>
            <a href="/featured" className="text-gray-600 hover:text-gray-900">
              Featured Products
            </a>
            <a
              href="/auth/Wishlist"
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <Heart className="w-4 h-4 mr-1" />
              Wishlist
            </a>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Show "Sign In" if NOT logged in, clicking it redirects to register */}
            {!isLoggedIn ? (
              <button
                onClick={() => navigate("/Rigster")}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            )}

            {/* Show My Account if logged in */}
            {isLoggedIn && (
              <a
                href="/account"
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <User className="w-4 h-4 mr-1" />
                My Account
              </a>
            )}

            <a href="/orders" className="text-gray-600 hover:text-gray-900">
              Order Tracking
            </a>

            {/* Currency Dropdown */}
            <div className="relative">
              <button
                className="flex items-center text-gray-600 hover:text-gray-900"
                onClick={() => setCurrencyOpen(!currencyOpen)}
              >
                USD
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              {currencyOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-md shadow-lg">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    USD
                  </button>

                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    EUR
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    GBP
                  </button>
                </div>
              )}
            </div>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                className="flex items-center text-gray-600 hover:text-gray-900"
                onClick={() => setLanguageOpen(!languageOpen)}
              >
                English
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              {languageOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    English
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Español
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Français
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
