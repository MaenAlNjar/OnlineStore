import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./index.css";

const AdminLayout = () => {
  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <ul className="menu">
          <li><Link to="dashboard">Category</Link></li>
          <li><Link to="create-product">Create Product</Link></li>
          <li><Link to="products">Products</Link></li>
        </ul>

        {/* Button at the end */}
        <div className="sidebar-footer">
          <Link to="/" className="back-home-btn">Back to Main</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-conten">
        <Outlet /> 
      </div>
    </div>
  );
};

export default AdminLayout;
