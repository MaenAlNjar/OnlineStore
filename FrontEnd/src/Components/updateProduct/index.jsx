import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiRequest from "../../lip/apiReq";

const UpdateProduct = ({ productId, onUpdateSuccess }) => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const { id } = useParams();


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiRequest.get(`Products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch product", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiRequest.get("categories/all");
        if (response.data.success) {
          setCategories(response.data.data);
        } else {
          console.error("Failed to load categories.");
        }
      } catch (err) {
        console.error("An error occurred while fetching categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: name === "categoryId" || name === "tag" ? Number(value) : value, // Convert categoryId and tag to number
    }));
  };

  const handleFileChange = (e) => {
    setProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in product) {
      formData.append(key, product[key]);
    }

    console.log("Sending FormData:", Object.fromEntries(formData));

    try {
      const response = await apiRequest.put(
        `Products/update/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        setMessage("Product updated successfully!");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Error updating product.");
      console.error(error);
    }
  };

  if (loading) return <p>Loading product details...</p>;

  return (
    <div className="update-product">
      <h2>Update Product</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={product.name || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={product.description || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={product.price || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Category ID:
          <select
            name="categoryId"
            value={product.categoryId || ""}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tag:
          <select name="tag" value={product.tag || ""} onChange={handleChange}>
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </label>
        <label>
          Image:
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default UpdateProduct;
