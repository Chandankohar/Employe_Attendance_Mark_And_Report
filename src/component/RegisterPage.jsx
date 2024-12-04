import React, { useState } from "react";
import "./styles/RegisterPage.css"; // Import your CSS file
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const url=process.env.REACT_APP_API_URL
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!name || !email || !password) {
        toast.error("Please enter details");
        return;
      }
      if (password.length<8) {
        toast.error("your password must be 8 digit");
        return;
      }
      const { data } = await axios.post(
        `${url}/employe/register`,
        { name, email, password }
      );
      if (data.success) {
        toast.success(data.message);
        setRedirect(true);
        return;
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data.message);
    }
  };
  if (redirect) {
    return <Navigate to={"/login"} />;
  }
  return (
    <>
      <header className="login-reg-header">
        Welcome To Employe Attandance
      </header>
      <div className="register-container">
        <div className="register-header">
          <div className="register-icon"></div>
          <h2>REGISTER</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="icon">&#128100;</span>
            <input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <span className="icon">&#128231;</span>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <span className="icon">&#128274;</span>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="register-button">
            REGISTER
          </button>
        </form>
        <div className="extra-options">
          <label>Back to login:</label>
          <Link id="signin" style={{ color: "Blue" }} to="/login">
            Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
