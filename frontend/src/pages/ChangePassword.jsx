import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { handelErros, handelSucess } from "../error/utils";
import Logo from "../assets/LogoWithName.jpeg";
import './Login.css';

export default function ChangePassword() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !email) {
      return handelErros(`Some Fields are missing. Please fill all the * fields`);
    }
    try {

      const url = "http://localhost:8080/password-reset";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });
      // console.log("Raw response:", response);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error from server:", errorData); // 👈 Important
        throw new Error(errorData.error || "Signup failed");
      }
      //  console.log("otp bhej dia h");
      const res = await response.json();
      // console.log(res);
      navigate("/verification", {
        state: {
          otp: res.otp,
          username: res.username,
          email: email,
        },
      });
    } catch (err) {
      handelErros(err.message);
    }
  };

  return (
    <div className="LoginPage">
      <img src={Logo} alt="Logo" className="login-logo" />
      <form className="login-form drop-in" style={{ animationDelay: "0s" }} onSubmit={handleSubmit}>

  <label htmlFor="username" className="drop-in" style={{ animationDelay: "0s" }}>
    Enter Leetcode Username *
  </label>
  <input
    type="text"
    id="username"
    name="username"
    autoComplete="username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="drop-in"
    style={{ animationDelay: "0.1s" }}
  />
  <br /><br />

  <label htmlFor="email" className="drop-in" style={{ animationDelay: "0.2s" }}>
    Enter Registered Email *
  </label>
  <input
    type="text"
    id="email"
    name="email"
    autoComplete="current-email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="drop-in"
    style={{ animationDelay: "0.3s" }}
  />
  <br /><br />

  <div className="LoginBtns drop-in" style={{ animationDelay: "0.4s" }}>
    <button className="btn btn-success">Reset Password</button>
    <button type="button" className="btn btn-primary" onClick={() => navigate("/login")}>
      Back To Login
    </button>
    <p>
      Not Registered? <Link to="/signup">Sign Up</Link>
    </p>
  </div>
</form>
      <ToastContainer />
    </div>
  );
}
