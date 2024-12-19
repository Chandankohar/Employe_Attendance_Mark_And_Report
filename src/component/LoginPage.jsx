import React, { useState } from "react";
import "./styles/LoginPage.css"; // External CSS file, you can also use inline styles
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const url=process.env.REACT_APP_API_URL
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        toast.error("Please enter details");
        return;
      }

      const response = await axios.post(
        `${url}/employe/login`,
        { email, password }
      );

      if (response.data?.success) {
        localStorage.setItem("employeToken", response.data.token);
        const valueToStore =
          typeof response.data.employee !== "string"
            ? JSON.stringify(response.data.employee)
            : response.data.employee;
        localStorage.setItem("employe", valueToStore);
        setRedirect(true);
        toast.success("Login Successful");
      } else {
        toast.error(response?.data.message);
      }
    } catch (err) {
      toast.error(err.response.data?.message);
    }
  };
  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <header className="login-reg-header">
        Welcome To Employe Attandance
      </header>
      <div className="login-container">
        <div className="login-header">
          <div className="login-icon"></div>
          <h2>LOGIN</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="icon">&#128100;</span>
            <input
              id="email"
              type="email"
              placeholder="Enter Email"
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
          <button type="submit" className="login-button">
            LOGIN
          </button>
          <div className="extra-options">
            <label>Click here to register:</label>
            <Link id="signup" style={{ color: "Blue" }} to="/register">
              Register
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
