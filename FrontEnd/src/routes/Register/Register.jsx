import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Form Data on Submit:", formData); 
  
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match!" });
      return;
    }
  
    try {
      const response = await axios.post("https://localhost:7226/register", {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword, 
      });
      setMessage(response.data);
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data.errors || error);
        setMessage(error.response.data.message || "Registration failed.");
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
  };
  

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Register</h2>
      {message && <div style={{ marginBottom: "15px", color: "green" }}>{message}</div>}
      <form onSubmit={handleSubmit}>
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
          {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}
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
          {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "8px",
              margin: "5px 0",
            }}
          />
          {errors.confirmPassword && <small style={{ color: "red" }}>{errors.confirmPassword}</small>}
        </div>
        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "blue", color: "white" }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: "10px", textAlign: "center" }}>
    Already have an account? <a href="/login" style={{ color: "blue" }}>Login here</a>
  </p>
    </div>
  );
};

export default Register;
