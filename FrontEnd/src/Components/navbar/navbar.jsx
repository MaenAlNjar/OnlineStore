import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";
import axios from "axios";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsLoggedIn(true);
      setUserData(user);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchCart();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [userData]);

  const fetchCart = async () => {
    if (!userData?.id) return;
    try {
      const response = await axios.get(
        `https://localhost:7226/user-cart/${userData.id}`
      );
      const cart = response.data.cart.products || [];
      setCartItems(cart);

      // Calculate total quantity of items in the cart
      const totalItems = cart.reduce(
        (count, product) => count + (product.quantity || 1),
        0
      );
      setCartItemsCount(totalItems);

      // Calculate total price of items in the cart
      const total = cart.reduce(
        (sum, product) => sum + product.price * (product.quantity || 1),
        0
      );
      setTotalPrice(total);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userData]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleCheckout = () => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    navigate(`/auth/ShoppingCart`);
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          KATAKITO<span className="text-yellow-500">.</span>
        </h2>

        <div className="nav-links">
          <a href="/" className="nav-link">
            Home
          </a>
          <a href="/auth/AdminPage" className="nav-link">
            Admin
          </a>
          <a href="/services" className="nav-link">
            Services
          </a>
          <a href="/contact" className="nav-link">
            Contact
          </a>
        </div>
        <div className="auth-section">
          {isLoggedIn && (
            <button className="cart-button" onClick={toggleSidebar}>
              <i className="fa-solid fa-cart-shopping"></i>{" "}
              <span className="cart-count">({cartItemsCount})</span>
            </button>
          )}
        </div>
      </div>

      {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      <div className={`Cart ${isSidebarOpen ? "active" : ""}`}>
        <div className="Cart-content">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.price}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
          <div className="checkout-section">
            <p>Total: ${totalPrice.toFixed(2)}</p>
            <button className="checkout-button" onClick={handleCheckout}>
              Checkout
            </button>
            <p className="checkout-note">Check out to change quantity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
