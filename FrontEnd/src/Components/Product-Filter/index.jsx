import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const ProductFilter = ({ onFilter }) => {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://localhost:7226/Category/all");
        if (response.data?.success && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleFilter = async () => {
    try {
      const response = await axios.get("https://localhost:7226/product/filter", {
        params: { name, categoryId: categoryId || undefined },
      });

      onFilter(response.data || []);
      console.log(response.data);
      
    } catch (error) {
      console.error("Error fetching products:", error);
      onFilter([]);
    }
  };

  return (
    <div className="filter-container">
      <h2>Search for a Product</h2>

      <input
        type="text"
        placeholder="Enter product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        <option value="">All Categories</option>
        {categories.length > 0 ? (
          categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))
        ) : (
          <option disabled>No categories available</option>
        )}
      </select>

      <button onClick={handleFilter}>Filter</button>
    </div>
  );
};

export default ProductFilter;
