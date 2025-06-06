import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import apiRequest from "../../lip/apiReq.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiRequest.post("users/login", {
        email,
        password,
      });

      if (response.data.success) {
        const user = response.data.user;
        localStorage.setItem("user", JSON.stringify(response.data.user));

        navigate("/auth/HomePage", { state: { user } });
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred while logging in."
      );
    }
  };
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/auth/HomePage");
    }
  }, [navigate]);
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button">
          Login
        </button>
        <p>
          Don't have an account? <Link to="/Rigster">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
