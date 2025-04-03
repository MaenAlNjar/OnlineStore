import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css"
const CreateProduct = () => {
  const initialProductState = {
    name: "",
    description: "",
    price: "",
    categoryId: "",
    categoryName: "", // Automatically set based on categoryId
    imageUrl: null,
  };

  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState(initialProductState);
  const [status, setStatus] = useState({
    message: "",
    loading: false,
    error: null,
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("https://localhost:7226/Category/all");
        setCategories(data.data || []); // Assuming `data.data` contains the category list
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // Check if the categoryId is being updated
    if (name === "categoryId") {
      const selectedCategory = categories.find(
        (category) => category.id === parseInt(value)
      );
      setProductData((prev) => ({
        ...prev,
        [name]: value,
        categoryName: selectedCategory ? selectedCategory.name : "", // Set categoryName based on selected category
      }));
    } else {
      setProductData((prev) => ({
        ...prev,
        [name]: type === "file" ? files[0] : value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", loading: true, error: null });

    try {
      if (!productData.name || !productData.price || !productData.categoryId) {
        throw new Error("Please fill in all required fields");
      }

      const formData = new FormData();
      formData.append("Name", productData.name);
      formData.append("Description", productData.description);
      formData.append("Price", parseFloat(productData.price));
      formData.append("CategoryId", parseInt(productData.categoryId));
      formData.append("Category.Name", productData.categoryName); // Send categoryName
      if (productData.imageUrl) {
        formData.append("ImageUrl", productData.imageUrl);
      }

      const { data } = await axios.post(
        "https://localhost:7226/Product/create",
        formData
      );

      if (data.success) {
        setStatus({
          message: "Product created successfully!",
          loading: false,
          error: null,
        });
        setProductData(initialProductState);
        document.querySelector('input[type="file"]').value = ""; // Clear file input
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setStatus({
        message: err.message || "Error creating product",
        loading: false,
        error: err.response?.data,
      });
    }
  };

  return (
    <div className="create-product-container">
    <h1>Create Product</h1>
    <form onSubmit={handleSubmit}>
      <div>
        <label>Product Name *</label>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={productData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          name="description"
          placeholder="Product Description"
          value={productData.description}
          onChange={handleChange}
        ></textarea>
      </div>
      <div>
        <label>Price *</label>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={productData.price}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Category *</label>
        <select
          name="categoryId"
          value={productData.categoryId}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Product Image</label>
        <input
          type="file"
          name="imageUrl"
          onChange={handleChange}
          accept="image/*"
        />
      </div>
      <button type="submit" disabled={status.loading}>
        {status.loading ? "Submitting..." : "Submit"}
      </button>
    </form>
    {status.message && <p>{status.message}</p>}
    {status.error && <p style={{ color: "red" }}>{status.error}</p>}
  </div>
  );
};

export default CreateProduct;
