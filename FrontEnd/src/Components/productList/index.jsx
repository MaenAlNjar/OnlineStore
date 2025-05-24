import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";
import ProductFilter from "../Product-Filter/index.jsx";
import apiRequest from "../../lip/apiReq";

const ProductList = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  const handleFilterResults = (filteredProducts) => {
    setFilteredProducts(filteredProducts);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await apiRequest.delete(`Products/delete/${productId}`);
      setFilteredProducts(
        filteredProducts.filter((product) => product.id !== productId)
      );
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleEditClick = (product) => {
    if (product._id) {
      navigate(`/auth/AdminPage/edit-product/${product._id}`);
    } else {
      console.error("Product ID is missing");
    }
  };
  

  return (
    <div className="product-list">
      <h2 className="product-list-title">Manage Products</h2>
      <ProductFilter onFilter={handleFilterResults} />
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <a href="#" className="product-name">
                {product.name}
              </a>
              <img
                src={product.image || "/placeholder.png"}
                alt={product.name}
                className="product-image"
              />
              <p className="product-price">
                {product.oldPrice && (
                  <span className="product-old-price">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                )}
                <span className={product.oldPrice ? "discount-price" : ""}>
                  ${product.price.toFixed(2)}
                </span>
              </p>
              <button
                className="edit-button"
                onClick={() => handleEditClick(product)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(product._id)}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
