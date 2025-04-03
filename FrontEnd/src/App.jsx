import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import "./App.css"; 


import LayoutAndAuthLayout from "./routes/layouts/layout.jsx";

import HomePage from "./routes/HomePage/HomePage.jsx";
import Login from "./routes/Login/login.jsx";
import Rigster from "./routes/Register/Register.jsx";
import AdminPage from "./routes/AdminPage/AdminPage";
import SinglePage from "./routes/SingleProduct/index.jsx";
import ShoppingCart from "./routes/paycheack/index.jsx"
import Wishlist from "./routes/WishList/index.jsx"
function App() {
  const { Layout, AuthLayout } = LayoutAndAuthLayout; 

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/login", element: <Login /> },
        { path: "/Rigster", element: <Rigster /> },
        { path: "/SinglePage", element: <SinglePage /> },
      ],
    },
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { path: "/auth/HomePage", element: <HomePage /> },
        { path: "/auth/AdminPage", element: <AdminPage /> },
        { path: "/auth/SinglePage/:id", element: <SinglePage /> },
        { path: "/auth/ShoppingCart", element: <ShoppingCart /> },
        { path: "/auth/Wishlist", element: <Wishlist /> },

      ],
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
