import React, { useState, useEffect } from "react";
import "./index.css";
import apiRequest from "../../lip/apiReq"
const ProductFilter = ({ onFilter }) => {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiRequest.get("categories/all");
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
      const params = {};
      if (name) params.name = name;
  
      if (categoryId) {
        params.categoryId = categoryId;
      }
  
      const response = await apiRequest.get("products/filter", {
        params: params,
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
