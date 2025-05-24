import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Heart, RefreshCw, ShoppingCart, Minus, Plus, Star, Info, Truck, Shield, Clock } from "lucide-react";
import axios from "axios";
import apiRequest from "../../lip/apiReq";

const SinglePage = () => {
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  useEffect(() => {
  
    const fetchProduct = async () => {
      try {
        const response = await apiRequest.get(`products/${id}`);
        setProduct(response.data);
        // If product has images array, set first one as selected
        if (response.data.images && response.data.images.length > 0) {
          setSelectedImage(0);
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md">
        <h3 className="font-bold">Error Loading Product</h3>
        <p>{error}</p>
      </div>
    </div>
  );

  // Mock data for display purposes - in real app, this would come from product
  const productImages = product.images || [product.image]; 
  const rating = product.rating || 4.5;
  const reviewCount = product.reviewCount || 24;
  
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        Home / {product.category} / {product.name}
      </div>
      
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Product Images Section */}
        <div className="lg:w-1/2">
          <div className="mb-4 border rounded-lg overflow-hidden bg-white shadow-sm">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-contain p-4"
            />
          </div>
          
          {/* Thumbnails */}
          {productImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {productImages.map((img, index) => (
                <div 
                  key={index} 
                  className={`w-20 h-20 border rounded cursor-pointer p-1 flex-shrink-0 
                    ${selectedImage === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`${product.name} - view ${index+1}`} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="lg:w-1/2">
          <div className="text-sm text-gray-500 uppercase tracking-wider mb-2">{product.category}</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {product.name}
          </h1>
          
          {/* Reviews */}
          <div className="flex items-center mb-6">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  fill={i < Math.floor(rating) ? "currentColor" : "none"}
                  className={i < Math.floor(rating) ? "" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">{rating} ({reviewCount} reviews)</span>
          </div>
          
          {/* Price & Stock */}
          <div className="mb-6">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800 mr-3">
                ${product.price.toFixed(2)}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="mt-2 text-sm">
              {product.inStock ? (
                <span className="text-green-600 font-medium">In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-6 text-gray-600 leading-relaxed">
            <p>{product.description || "No description available for this product."}</p>
          </div>
          
          {/* Divider */}
          <hr className="my-6 border-gray-200" />
          
          {/* Add to Cart */}
          <div className="mb-6">
            <div className="flex items-center">             
              <button className="ml-4 flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition duration-200 shadow-sm">
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
          
          {/* Wishlist & Compare */}
          <div className="flex gap-6 mb-6">
            <button className="flex items-center text-gray-600 hover:text-blue-600 text-sm transition duration-200">
              <Heart size={16} className="mr-1" />
              Add to Wishlist
            </button>
            <button className="flex items-center text-gray-600 hover:text-blue-600 text-sm transition duration-200">
              <RefreshCw size={16} className="mr-1" />
              Compare
            </button>
          </div>
          
          {/* Benefits */}
          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Truck size={20} className="text-blue-600 mr-2" />
                <span className="text-sm">Free shipping</span>
              </div>
              <div className="flex items-center">
                <Shield size={20} className="text-blue-600 mr-2" />
                <span className="text-sm">2 year warranty</span>
              </div>
              <div className="flex items-center">
                <Clock size={20} className="text-blue-600 mr-2" />
                <span className="text-sm">24/7 support</span>
              </div>
            </div>
          </div>
          
          {/* Product details/codes */}
          <div className="mt-6 text-sm text-gray-500">
            <p>SKU: {product.sku || `SKU-${id}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePage;