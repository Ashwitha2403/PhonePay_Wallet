import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    phoneNumber: "",
    pin: ""
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch("https://phonepay-wallet.onrender.com/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok && data.message === "Login successful") {

        localStorage.setItem("phoneNumber", loginData.phoneNumber);
        localStorage.setItem("userId", data.userId);

        navigate("/dashboard");

      } else {
        alert(data.message || "Invalid phone number or PIN");
      }

    } catch (error) {
      console.error("Login Error:", error);
      alert("Unable to connect to server. Please try again.");
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h1 className="logo">PhonePe</h1>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            name="phoneNumber"
            placeholder="Enter Phone Number"
            value={loginData.phoneNumber}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="pin"
            placeholder="Enter PIN"
            value={loginData.pin}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

        <p className="register-link">
          Don't have an account?
          <span onClick={() => navigate("/register")}>
            Register
          </span>
        </p>

      </div>

    </div>
  );
}

export default Login;