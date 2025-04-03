import React, { useEffect } from "react";
import Navbar from "../../Components/navbar/navbar.jsx";
import TopNavbar from "../../Components/upNavbar/index.jsx";
import "./Layout.css"; // Import the CSS file
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "../../Components/Footer/index.jsx";

const Layout = () => {
  return (
    <div className="layout-container">
      <>
        <TopNavbar />
        <Navbar />
      </>
      <main className="main-content">
        <Outlet />
      </main>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

const AuthLayout = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  const hideNavbar = location.pathname.startsWith("/auth/AdminPage");
  return (
    <div className="auth-layout">
      {!hideNavbar && (
        <>
          <TopNavbar />
          <Navbar />
        </>
      )}
      <div className="main-content">
        <Outlet />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default { Layout, AuthLayout };
