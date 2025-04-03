import React, { useState } from "react";
import UpdateProduct from "../updateProduct/index.jsx";
import axios from "axios";
import "./index.css";
import ProductFilter from "../Product-Filter/index.jsx";

const ProductList = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]); // Store only filtered products

  const handleFilterResults = (filteredProducts) => {
    setFilteredProducts(filteredProducts);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await axios.delete(`https://localhost:7226/Product/delete/${productId}`);
      setFilteredProducts(filteredProducts.filter((product) => product.id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="product-list">
      <h2 className="product-list-title">Manage Products</h2>
      
      {/* Product Filter Component */}
      <ProductFilter onFilter={handleFilterResults} />

      {/* Display Filtered Products */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              
              <a href="#" className="product-name">{product.name}</a>
              
              <img src={product.image || "/placeholder.png"} alt={product.name} className="product-image" />
              
              <p className="product-price">
                {product.oldPrice && <span className="product-old-price">${product.oldPrice.toFixed(2)}</span>}
                <span className={product.oldPrice ? "discount-price" : ""}>${product.price.toFixed(2)}</span>
              </p>
          
              <button className="edit-button" onClick={() => setSelectedProduct(product)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDelete(product.id)}>
                  Remove
                </button>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {selectedProduct && (
        <div className="update-section">
          <h3 className="selected-product-name">Editing: {selectedProduct.name}</h3>
          <UpdateProduct
            productId={selectedProduct.id}
            onUpdateSuccess={() => {
              setSelectedProduct(null);
              setFilteredProducts(filteredProducts.map((p) => 
                p.id === selectedProduct.id ? { ...p, ...selectedProduct } : p
              ));
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;
