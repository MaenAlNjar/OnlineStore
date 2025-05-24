import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import "./index.css";
import apiRequest from "../../lip/apiReq";
const SearchFilter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiRequest.get("categories/all");
        if (response.data.success) {
          setCategories(response.data.data);
        } else {
          console.log("Failed to load categories");
        }
      } catch (err) {
        console.log("Failed ");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm.length < 1) {
      setFilteredProducts([]); // Clear results when search is empty
      return;
    }

    const fetchFilteredProducts = async () => {
      try {
        const categoryId =
          selectedCategory !== "All Categories"
            ? categories.find((cat) => cat.name === selectedCategory)?.id
            : null;
        const response = await apiRequest.get("products/filter", {
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
        console.log("Failed to load categories");
      } finally {
        console.log("Failed to load categories");
      }
    };

    fetchFilteredProducts();
}, [searchTerm, selectedCategory, categories]);

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
