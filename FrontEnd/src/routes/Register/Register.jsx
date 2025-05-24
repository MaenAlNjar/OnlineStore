import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lip/apiReq.js";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiRequest.post("users/register", {
        username:formData.username,
        email: formData.email,
        password: formData.password,
      });

      setMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);

      setFormData({ email: "", password: "" });
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data.errors || {});
        setMessage(error.response.data.message || "Registration failed.");
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Register</h2>
      {message && (
        <div style={{ marginBottom: "15px", color: "green" }}>{message}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "8px",
              margin: "5px 0",
            }}
          />
          {errors.username && (
            <small style={{ color: "red" }}>{errors.username}</small>
          )}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "8px",
              margin: "5px 0",
            }}
          />
          {errors.email && (
            <small style={{ color: "red" }}>{errors.email}</small>
          )}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "8px",
              margin: "5px 0",
            }}
          />
          {errors.password && (
            <small style={{ color: "red" }}>{errors.password}</small>
          )}
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "blue",
            color: "white",
          }}
        >
          Register
        </button>
      </form>
      <p style={{ marginTop: "10px", textAlign: "center" }}>
        Already have an account?{" "}
        <a href="/login" style={{ color: "blue" }}>
          Login here
        </a>
      </p>
    </div>
  );
};

export default Register;
