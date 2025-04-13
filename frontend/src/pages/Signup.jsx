import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { useState } from "react";
import { handelErros, handelSucess } from "../error/utils";
import "./Signup.css"
import Logo from "../assets/LogoWithName.jpeg";
import { Navigate, useLocation } from "react-router-dom";
export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    if (confirmPassword !== password) {
      return handelErros("Password and Confirm Password do not match.");
    }
    if (!username || !password || !email) {
      return handelErros("Please fill in all required fields.");
    }
    //  console.log("came");;
    try {
      const url = "https://lc-tracker-vwrn.onrender.com/usersignup";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Signup failed");
      }
      // console.log("user made");
      const res = await response.json();
      handelSucess(`Account for ${res.user.username} Created`);
      setTimeout(() => {
         navigate(`/login`);
      }, 1000);
   
     
    } catch (err) {
      handelErros(err.message);
    }
  };

  return (
    <div className="LoginPage"> {/* 👈 Apply background and centering */}
      {/* Optional Logo: <img src="/your-logo.png" className="login-logo" /> */}
      <img src={Logo} alt="Logo" className="login-logo" />
      <form className="login-form" onSubmit={handleSignup}>
        <label htmlFor="username">Enter LC Username *</label>
        <input  name="username" type="text" onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
        
        <label htmlFor="password">Enter Password *</label>
        <input name="password" type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
        
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <input name="confirmPassword" type="password" onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
        
        <label htmlFor="email">Enter Email *</label>
        <input name="email" type="text" onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
        <div className="signup-btns">
  <button type="submit" className="signup-btn btn btn-success">Sign Up</button>
  <p > Already have an account? <button onClick={() => navigate("/login")}>Login</button></p>
        </div>
     
      </form>
      <ToastContainer />
    </div>
  );
}