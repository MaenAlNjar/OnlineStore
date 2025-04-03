import React, { useState, useEffect } from "react";
import axios from "axios";

const ShoppingCart = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const shippingCost = 300.0;
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user && user.id) {
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`https://localhost:7226/user-cart/${user.id}`);
      console.log("Cart Response:", response.data.cart.products);
      setCartItems(response.data.cart.products || []);
            console.log(cartItems);
      
    } catch (error) {
      console.error("Failed to fetch cart:", error.response?.data?.message || error.message);
      setCartItems([]); // Prevent undefined state
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
  
    try {
      const response = await axios.put(
        `https://localhost:7226/cart/update?userId=${user.id}&productId=${productId}&quantity=${newQuantity}`
      );
  
      // Ensure each item in the updated list has a unique key
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error.response?.data?.message || error.message);
    }
  };
  
  const removeItem = async (productId) => {
    try {
      await axios.delete(
        `https://localhost:7226/cart/remove?userId=${user.id}&productId=${productId}`
      );
  
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    } catch (error) {
      console.error("Error removing item:", error.response?.data?.message || error.message);
    }
  };
  

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shippingCost;

  return (
    <div className="container mx-auto p-4">
      <div className="w-full">
        <div className="grid grid-cols-4 border-b pb-2 mb-4">
          <div className="col-span-1">Product</div>
          <div className="col-span-1 text-right">Price</div>
          <div className="col-span-1 text-center">Quantity</div>
          <div className="col-span-1 text-right">Total</div>
        </div>

        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="grid grid-cols-4 items-center py-4 border-b">
              <div className="col-span-1 flex items-center">
                <button onClick={() => removeItem(item.id)} className="text-gray-400 mr-4">×</button>
                <div className="w-16 h-16 border p-2 mr-4">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div>{item.name}</div>
              </div>
              <div className="col-span-1 text-right">${item.price.toFixed(2)}</div>
              <div className="col-span-1 flex justify-center">
                <div className="flex border rounded w-32">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1">−</button>
                  <input type="text" value={item.quantity} className="w-full text-center" readOnly />
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1">+</button>
                </div>
              </div>
              <div className="col-span-1 text-right">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}

        <div className="flex justify-between mt-8">
          <div className="flex">
            <input
              type="text"
              placeholder="Coupon code"
              className="border rounded-l px-4 py-2"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button className="bg-gray-800 text-white px-4 py-2 rounded-r">Apply coupon</button>
          </div>
          <div className="flex">
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2">Update cart</button>
            <button className="bg-yellow-400 text-gray-800 px-4 py-2 rounded">Proceed to checkout</button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-medium border-b pb-4 mb-6">Cart totals</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="font-medium">Subtotal</div>
            <div className="text-right">${subtotal.toFixed(2)}</div>

            <div className="font-medium">Shipping</div>
            <div className="text-right">
              <div>Flat Rate: ${shippingCost.toFixed(2)}</div>
              <div className="text-blue-600 mt-1">Calculate Shipping</div>
            </div>

            <div className="font-medium pt-4 border-t">Total</div>
            <div className="text-right font-bold pt-4 border-t">${total.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
