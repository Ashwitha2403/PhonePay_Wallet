import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {

  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    phoneNumber: "",
    upiId: "",
    pin: ""
  });

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {

    e.preventDefault();

    const response = await fetch("http://localhost:8080/user/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(userData)
    });

    const data = await response.text();

    if(data === "User registered successfully"){
        alert("Registration Successful");
        navigate("/");
    } else {
        alert("Registration failed");
    }

  };

  return (

    <div className="register-container">

      <div className="register-card">

        <h1 className="logo">PhonePe Register</h1>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={userData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phoneNumber"
            placeholder="Enter Phone Number"
            value={userData.phoneNumber}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="upiId"
            placeholder="Enter UPI ID"
            value={userData.upiId}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="pin"
            placeholder="Create PIN"
            value={userData.pin}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Register
          </button>

        </form>

        <p className="login-link">
          Already have an account?
          <span onClick={() => navigate("/")}>
            Login
          </span>
        </p>

      </div>

    </div>

  );
}

export default Register;