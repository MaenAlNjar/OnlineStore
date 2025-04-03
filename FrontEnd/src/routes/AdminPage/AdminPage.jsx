import React, { useState } from "react";
import "./index.css"; // Import the external CSS file
import CatrgoryCreate from "../../Components/Category/index.jsx";
import Products from "../../Components/Product/index.jsx";
import ProductList from "../../Components/productList/index.jsx";
const Dashboard = () => <div>Dashboard Content</div>;
const Users = () => <div>Users Management</div>;
const Settings = () => <div>Settings Page</div>;

const AdminPage = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <CatrgoryCreate />;
      case "users":
        return <Products />;
      case "settings":
        return <ProductList />;
      default:
        return <CatrgoryCreate />;
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <ul className="menu">
          <li>
            <button onClick={() => setActiveComponent("dashboard")}>
              Category 
            </button>
          </li>
          <li>
            <button onClick={() => setActiveComponent("users")}>Create Product </button>
          </li>
          <li>
            <button onClick={() => setActiveComponent("settings")}>
            Products
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-conten">{renderComponent()}</div>
    </div>
  );
};

export default AdminPage;
