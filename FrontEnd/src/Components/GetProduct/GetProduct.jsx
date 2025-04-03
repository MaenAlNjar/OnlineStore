import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.css"
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://localhost:7226/Product/all");
        
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    const userId =user.id // Retrieve the UserId
  
    if (!userId) {
      alert("User not logged in!");
      return;
    }
  
    try {
        const response = await axios.post(
            `https://localhost:7226/add-to-cart?productId=${productId}&userId=${userId}`
          );
  
      if (response.data.success) {
        setCartMessage(`Product added to cart successfully!`);
      } else {
        setCartMessage(`Failed to add product to cart: ${response.data.message}`);
      }
  
      setTimeout(() => setCartMessage(""), 3000); // Clear message after 3 seconds
    } catch (error) {
      setCartMessage("Error adding product to cart.");
      console.error(error);
    }
  };
  
  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="product-list-container">
      <h2 className="heading">Product List</h2>
      {cartMessage && <div className="cart-message">{cartMessage}</div>}
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image || "/placeholder.png"}
              alt={product.name}
              className="product-image"
            />
            <div className="product-details">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">Price: ${product.price.toFixed(2)}</p>
              <p className="product-category">
                Category: {product.category?.name || "Uncategorized"}
              </p>
              <button
                className="add-to-cart-button"
                onClick={() => addToCart(product.id)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
