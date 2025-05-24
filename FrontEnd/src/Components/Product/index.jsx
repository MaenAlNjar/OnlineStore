import React, { useState, useEffect } from "react";
import "./index.css";
import apiRequest from "../../lip/apiReq";

const CreateProduct = () => {
  const initialProductState = {
    name: "",
    description: "",
    price: "",
    categoryId: "",
    categoryName: "",
    image: null,
  };

  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState(initialProductState);
  const [status, setStatus] = useState({
    message: "",
    loading: false,
    error: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await apiRequest.get("categories/all");
        setCategories(data.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name === "categoryId") {
      const selectedCategory = categories.find(
        (category) => category.id === parseInt(value)
      );
      setProductData((prev) => ({
        ...prev,
        [name]: value,
        categoryName: selectedCategory ? selectedCategory.name : "",
      }));
    } else if (type === "file") {
      setProductData((prev) => ({
        ...prev,
        image: files[0], // Save the selected image file
      }));
    } else {
      setProductData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", loading: true, error: null });

    try {
      if (!productData.name || !productData.price || !productData.categoryId) {
        throw new Error("Please fill in all required fields");
      }

      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", parseFloat(productData.price));
      formData.append("categoryId", productData.categoryId);
      if (productData.image) {
        formData.append("image", productData.image); // Add image to formData
      }

      const { data } = await apiRequest.post("products/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });

      if (data.success) {
        setStatus({
          message: "Product created successfully!",
          loading: false,
          error: null,
        });
        setProductData(initialProductState); // Reset form data
        document.querySelector('input[type="file"]').value = ""; // Clear the file input
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
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={status.loading}>
          {status.loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {status.message && <p>{status.message}</p>}
      {status.error && (
        <p style={{ color: "red" }}>
          {typeof status.error === "string"
            ? status.error
            : status.error.message || "An error occurred"}
        </p>
      )}
    </div>
  );
};

export default CreateProduct;
