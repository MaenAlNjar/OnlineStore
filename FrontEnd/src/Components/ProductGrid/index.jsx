import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import apiRequest from "../../lip/apiReq";

const ProductGrid = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState(new Set());
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const id = user?.id || user?._id;
    if (id) setUserId(id);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiRequest.get("categories/all");
        if (response.data?.data) {
          setCategories(response.data.data);
          setSelectedCategory(response.data.data[0]?.name || null); // أول تصنيف افتراضيًا
          console.log(error,"fixing error ");
          
        } else {
          setError("فشل في تحميل التصنيفات.");
        }
      } catch (err) {
        setError("حدث خطأ أثناء تحميل التصنيفات.");
      }
    };
    fetchCategories();
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!selectedCategory) return;

        const response = await apiRequest.get("/categories/byCategory", {
          params: { category: selectedCategory },
        });
        console.log(response);

        if (response.data) {
          setProducts(response.data);
        } else {
          setProducts([]);
          setError("لا توجد منتجات.");
        }
      } catch (err) {
        setError("حدث خطأ أثناء تحميل المنتجات.");
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?._id) return;

        const response = await apiRequest.get(
          `wishlist/user-wishlist?userId=${user._id}`
        );

        const productIds = response.data.map(
          (item) => item.productId?._id || item.productId
        );

        setWishlist(new Set(productIds));
        localStorage.setItem("wishlist", JSON.stringify(productIds));
      } catch (err) {
        const cached = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlist(new Set(cached));
      }
    };

    fetchWishlist();
  }, []);

  const addToCart = async (productId) => {
    if (!userId) {
      toast.error("الرجاء تسجيل الدخول أولاً.");
      return;
    }

    try {
      const response = await apiRequest.post(`cart/add-to-cart`, {
        productId,
        userId,
      });

      if (response) {
        toast.success("تمت إضافة المنتج إلى السلة!");
      } else {
        toast.error("فشل في الإضافة إلى السلة.");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الإضافة إلى السلة.");
    }
  };

  const toggleWishlist = async (productId) => {
    if (!userId) {
      toast.error("الرجاء تسجيل الدخول أولاً.");
      return;
    }

    try {
      const response = await apiRequest.get(
        `wishlist/check/${userId}/${productId}`
      );
      const isInWishlist = response.data.exists;

      if (isInWishlist) {
        await apiRequest.delete(`wishlist/remove/${userId}/${productId}`);
        setWishlist((prev) => {
          const updated = new Set(prev);
          updated.delete(productId);
          localStorage.setItem("wishlist", JSON.stringify([...updated]));
          return updated;
        });
      } else {
        await apiRequest.post("wishlist/add", {
          userId,
          productId,
        });
        setWishlist((prev) => {
          const updated = new Set(prev).add(productId);
          localStorage.setItem("wishlist", JSON.stringify([...updated]));
          return updated;
        });
      }
    } catch (err) {
      toast.error("فشل في تحديث المفضلة.");
    }
  };

  return (
    <div className="p-6" style={{ maxWidth: "1300px", margin: "0 auto" }}>
  {/* 🔹 Tabs / Buttons for Categories */}
  <div className="flex gap-3 flex-wrap mb-6">
    {categories.map((cat) => (
      <button
        key={cat._id}
        onClick={() => setSelectedCategory(cat.name)}
        className={`px-4 py-2 rounded-full border transition ${
          selectedCategory === cat.name
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
        }`}
      >
        {cat.name}
      </button>
    ))}
  </div>

  {/* 🔹 Product Grid */}
  {products.length > 0 ? (
    <div className="grid grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
        >
          <Link
            to={`/auth/SinglePage/${product._id}`}
            className="block mb-2 text-blue-600 hover:text-blue-800 text-sm font-medium text-center"
          >
            {product.name}
          </Link>
          <div className="w-32 h-32 flex justify-center items-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex items-center justify-between w-full mt-4">
            <span className="text-lg font-semibold">
              ${product.price.toFixed(2)}
            </span>
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-full transition"
              onClick={() => addToCart(product._id)}
            >
              🛒 Add to Cart
            </button>
          </div>
          <button
            onClick={() => toggleWishlist(product._id)}
            className={`mt-2 text-sm ${
              wishlist.has(product._id) ? "text-red-500" : "text-gray-500"
            } hover:text-red-600 transition`}
          >
            {wishlist.has(product._id) ? "❤️" : "🤍"}
          </button>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-center text-gray-500">لا توجد منتجات.</p>
  )}
</div>

  );
};

export default ProductGrid;
