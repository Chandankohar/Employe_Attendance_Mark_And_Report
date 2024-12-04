import React, { useEffect, useState } from "react";
import "./styles/DashboardPage.css"; // Import your CSS file
import { Link, Navigate } from "react-router-dom";
import Content from "./Content";

const DashboardPage = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [user, setUser] = useState(null);
  const [redirect, setredirect] = useState(false);

  useEffect(() => {
    const userdetail = localStorage.getItem("employe");
    setUser(JSON.parse(userdetail));
  }, []);

  const showSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  const logout = () => {
    localStorage.removeItem("employe");
    localStorage.removeItem("employeToken");
    setredirect(true);
  };

  if (!localStorage.getItem("employeToken")) {
    return <Navigate to={"/login"} />;
  }
  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div>
      <header>Welcome To Employe Attandance</header>
      <div className="dashboard-container">
        <Sidebar showSection={showSection} logout={logout} />
        <Content user={user} activeSection={activeSection} />
      </div>
    </div>
  );
};

const Sidebar = ({ showSection, logout }) => (
  <div className="sidebar">
    <Link id="home" className="sidebar-a" to="/" onClick={() => showSection("home")}>
      Home
    </Link>

    <Link id="attendancedetail" className="sidebar-a" to="/" onClick={() => showSection("attendance-details")}>
      Attendance Details
    </Link>
    <Link id="logout" className="sidebar-a" to="/" onClick={logout}>
      Logout
    </Link>
  </div>
);

export default DashboardPage;
