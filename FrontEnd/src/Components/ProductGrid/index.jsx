import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom"; 
import { toast } from 'react-hot-toast';
const ProductGrid = () => {
  const [categories, setCategories] = useState([]); 
  const [products, setProducts] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [error, setError] = useState(""); 
  const [CartMessage,setCartMessage]=useState("")
  const user = JSON.parse(localStorage.getItem("user"));


  const addToCart = async (productId) => {
    const userId = user?.id; 
  
    if (!userId) {
      toast.error("User not logged in!");
      return;
    }
  
    try {
      const response = await axios.post(
        `https://localhost:7226/add-to-cart?productId=${productId}&userId=${userId}`
      );
  
      if (response) {
        toast.success("Product added to cart!");
      } else {
        toast.error(`Failed to add product: ${response.data.message}`);
        console.log(response.data);
        
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };
  
  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://localhost:7226/Category/all');
        if (response.data && response.data.success) {
          setCategories(response.data.data);
        } else {
          setError(response.data.message || "Failed to load categories.");
        }
      } catch (err) {
        setError("An error occurred while fetching categories.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = selectedCategory
          ? `https://localhost:7226/Product/byCategory?category=${selectedCategory}`
          : `https://localhost:7226/Product/all`;

        const response = await axios.get(url);

        if (response.data) {
          setProducts(response.data); 
        } else {
          setProducts([]); 
          setError(response.data.message || "No products found.");
        }
      } catch (err) {
        setError("An error occurred while fetching products.");
      }
    };

    fetchProducts();
  }, [selectedCategory]); 

  return (
    <div className="containe mx-auto p-6 h-dvh">
    {/* Category Navigation */}
    <nav className="flex gap-4 mb-8 text-sm border-b pb-2">
      <button
        className={`hover:text-blue-600 ${selectedCategory === null ? 'font-bold text-blue-600' : ''}`}
        onClick={() => setSelectedCategory(null)}
      >
        All
      </button>
      {categories.length > 0 ? (
        categories.map((category) => (
          <button
            key={category.id}
            className={`hover:text-blue-600 ${selectedCategory === category.name ? 'font-bold text-blue-600' : ''}`}
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.name}
          </button>
        ))
      ) : (
        <p className="text-gray-500">No categories found.</p>
      )}
    </nav>
  
    {/* Error Message */}
    {error && <p className="text-red-500">{error}</p>}
   {/* Product Grid */}
   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
              <div className="text-xs text-gray-600 mb-2">{product.category}</div>
              <Link 
                to={`/auth/SinglePage/${product.id}`} 
                className="block mb-2 text-blue-600 hover:text-blue-800 text-sm font-medium text-center"
              >
                {product.name}
              </Link>
              <div className="w-32 h-32 flex justify-center items-center">
                <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="flex items-center justify-between w-full mt-4">
                <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-full transition"
                onClick={() => addToCart(product.id)}
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-4 text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;