import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { useState } from "react";
import { handelErros, handelSucess } from "../error/utils";
import "./Signup.css"
import Logo from "../assets/LogoWithName.jpeg";
import {  useLocation } from "react-router-dom";

export default function NewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { username:username ,email:email} = location.state || {};
  // console.log("Received username:", username);

  const handleSignup = async (event) => {
    event.preventDefault();
  
    if (confirmPassword !== password) {
      return handelErros("Password and Confirm Password do not match.");
    }

    // console.log(username);
    if (!password || !confirmPassword) {
      return handelErros("Please fill in all required fields.");
    }
  
    try {
      const url = "https://lc-tracker-vwrn.onrender.com/newpassword";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username,email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Signup failed to change password");
      }
       
      const res = await response.json();
      handelSucess(`Signed Up As ${res.user.username}`);
      // console.log("password change ho gya h guys");
      setTimeout(() => {
        navigate("/login"); // 👈 Replace this with your desired route
      }, 2000);
  
    } catch (err) {
      handelErros(err.message);
    }
  };

  return (
    <div className="LoginPage">

      <img src={Logo} alt="Logo" className="login-logo" />
      <form className="login-form" onSubmit={handleSignup}>
        
        <label htmlFor="password">Enter Password *</label>
        <input name="password" type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
        
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <input name="confirmPassword" type="password" onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
        
        <div className="signup-btns">
        <button type="submit" className="signup-btn btn btn-success">Change</button>
        <p > Don't have Account? <button onClick={() => navigate("/signup")}>SignUp</button></p>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}