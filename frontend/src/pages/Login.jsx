import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { handelErros, handelSucess } from "../error/utils";
import Logo from "../assets/LogoWithName.jpeg";
import './Login.css';
import { useTypewriter } from 'react-simple-typewriter';
import { Box, Typography } from '@mui/material';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  localStorage.setItem("username", "");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      return handelErros(`Some Fields are missing. Please fill all the * fields`);
    }
    try {
      const url = "http://localhost:8080/userlogin";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Signup failed");
      }

      const res = await response.json();
      handelSucess(`Signed In As ${res.user.username}`);
      setTimeout(() => {
        localStorage.setItem("username", res.user.username);
        navigate(`/user/${res.user.username}`);
      }, 1000);

    } catch (err) {
      handelErros(err.message);
    }
  };

  const [text] = useTypewriter({
    words: ['Grow', 'Track', 'Progress'],
    loop: true,
    delaySpeed: 1500,
  });
  const [footerText] = useTypewriter({
    words: ['By Shashank Tiwari'],
    loop: true,
    delaySpeed: 2000,
  });
  return (
    <div className="LoginPage">
      <img src={Logo} alt="Logo" className="login-logo" />
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4">
          Welcome To CodeMate, We Help You{' '}
          <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>
            {text}<span className="cursor">|</span>
          </span>
        </Typography>
      </Box>
      <br />
     

      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Enter LC Username *</label>
        <input
          type="text"
          id="username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />

        <label htmlFor="password">Enter Password *</label>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="LoginBtns">
          <button type="submit" className="btn btn-success">Login</button>
          <button type="button" className="btn btn-danger" onClick={() => navigate("/ChangePass")}>
            Forgot Password?
          </button>
          <p>
            Not Registered? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </form>

      <ToastContainer />
      <footer className="footer">
        <Box sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
          <Typography variant="h5" sx={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ffffff' }}>
            {footerText}
          </Typography>
        </Box>
      </footer>

      
    </div>
  );
}
