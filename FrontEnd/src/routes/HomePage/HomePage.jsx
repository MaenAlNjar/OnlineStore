import "./index.css";
import Header from "../../Components/Header/index.jsx";
import SearchFilter from "../../Components/SearchFilter/index.jsx";
import ProductGrid from "../../Components/ProductGrid/index.jsx";
import ProductGrid2 from "../../Components/ProductGrid2/index.jsx";

const HomePage = () => {


  return (
    <div className="homepage">
      {/* Main Content Area */}
      <div className="Homepage-Contiener">
        <div className="SearchFilter">
          <SearchFilter />
        </div>
        <div className="Header">
          <Header />
        </div>
        <div className="Section1">
          <ProductGrid />
        </div>
        <div className="Section2">
          <ProductGrid2 />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
