import { useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import "./Verification.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handelErros, handelSucess } from "../error/utils";
import Logo from "../assets/LogoWithName.jpeg";
import './Login.css';
import { ToastContainer } from 'react-toastify';

export default function Verification({ onSubmit }) {
  const location = useLocation();
  const { otp: otp, username:  username , email:email } = location.state || {};
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  
  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d?$/.test(value)) return; // Allow only single digit
    e.target.value = value;

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = inputsRef.current.map((input) => input.value).join("");
    // console.log(otp);
    if (enteredOtp === String(otp)) {
        // console.log("if a gya");
        handelSucess("✅ OTP verified successfully");
        // console.log("Username to send:", username);
        setTimeout(() => {
          navigate("/newpassword", {
            state: {
              username:username,
              email:email
            },
          });
        }, 2000);
      } else {
        // console.log("else a gya");
        handelErros("❌ OTP didn't match");
      }
      
  };
  return (
    <div className="otp-page">
      <img src={Logo} alt="Logo" className="login-logo" />   
      <form className="otp-form" onSubmit={handleSubmit}>
        <h2>Enter OTP</h2>
        <div className="otp-container">
          {[0, 1, 2, 3].map((_, idx) => (
            <input
              key={idx}
              className="otp-input"
              maxLength="1"
              type="text"
              ref={(el) => (inputsRef.current[idx] = el)}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              style={{ animationDelay: `${idx * 0.1}s` }}
            />
          ))}
        </div>
        <button type="submit">Verify OTP</button>
      </form>
      <ToastContainer />
    </div>
  );
}
