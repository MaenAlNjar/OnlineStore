import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import "./index.css";
import axios from "axios";

const SearchFilter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://localhost:7226/Category/all");
        if (response.data.success) {
          setCategories(response.data.data);
        } else {
          setError(response.data.message || "Failed to load categories.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      }
    };

    fetchCategories();
  }, []);

  // Fetch filtered products based on search and selected category
  useEffect(() => {
    if (searchTerm.length < 1) {
      setFilteredProducts([]); // Clear results when search is empty
      return;
    }

    const fetchFilteredProducts = async () => {
      setIsLoading(true);
      try {
        const categoryId =
          selectedCategory !== "All Categories"
            ? categories.find((cat) => cat.name === selectedCategory)?.id
            : null;
        const response = await axios.get("https://localhost:7226/product/filter", {
          params: {
            name: searchTerm,
            categoryId: categoryId,
          },
        });

        if (response.data) {
          setFilteredProducts(response.data.slice(0, 3));
        } else {
          setFilteredProducts([]);
        }
      } catch (err) {
        setError("An error occurred while fetching products.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [searchTerm, selectedCategory]);

  return (
    <div className="search-filter-wrapper">
      <div className="search-filter-container">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search for Products"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Category Dropdown */}
        <div
          className={`category-dropdown ${isDropdownOpen ? "open" : ""}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <button className="category-button">
            {selectedCategory}
            <ChevronDown size={16} />
          </button>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li
                className="dropdown-item"
                onClick={() => setSelectedCategory("All Categories")}
              >
                All Categories
              </li>
              {categories.map((category, index) => (
                <li
                  key={index}
                  className="dropdown-item"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search Button */}
        <button className="search-button">
          <Search size={20} />
        </button>
      </div>

      {/* Display filtered products under search bar */}
      {filteredProducts.length > 0 && (
        <div className="filtered-products">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <div className="product-details">
                <h4>{product.name}</h4>
                <span>${product.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
