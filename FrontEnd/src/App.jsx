import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";

import LayoutAndAuthLayout from "./routes/layouts/layout.jsx";

import HomePage from "./routes/HomePage/HomePage.jsx";
import Login from "./routes/Login/login.jsx";
import Rigster from "./routes/Register/Register.jsx";
import AdminLayout from "./routes/AdminPage/AdminPage.jsx";
import SinglePage from "./routes/SingleProduct/index.jsx";
import ShoppingCart from "./routes/paycheack/index.jsx";
import Wishlist from "./routes/WishList/index.jsx";
import CatrgoryCreate from "./Components/Category/index.jsx"
import Products from "./Components/Product/index.jsx"
import ProductList from "./Components/productList/index.jsx"
import UpdateProduct from "./Components/updateProduct/index.jsx"
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
        { path: "HomePage", element: <HomePage /> },
        {
          path: "AdminPage",
          element: <AdminLayout />,
          children: [
            { path: "dashboard", element: <CatrgoryCreate /> },
            { path: "create-product", element: <Products /> },
            { path: "products", element: <ProductList /> },
            { path: "edit-product/:id", element: <UpdateProduct /> },
          ],
        },
        { path: "SinglePage/:id", element: <SinglePage /> },
        { path: "ShoppingCart", element: <ShoppingCart /> },
        { path: "Wishlist", element: <Wishlist /> },
      ],
    }
    
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
