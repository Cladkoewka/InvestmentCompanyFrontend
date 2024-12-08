import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './NavBar.css';

const NavBar = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar__links">
        <Link className="navbar__link" to="/">Home</Link>
        <Link className="navbar__link" to="/projects">Projects</Link>
        <Link className="navbar__link" to="/assets">Assets</Link>
        <Link className="navbar__link" to="/customers">Customers</Link>
        <Link className="navbar__link" to="/departments">Departments</Link>
        <Link className="navbar__link" to="/employees">Employees</Link>
        <Link className="navbar__link" to="/risks">Risks</Link>
        <Link className="navbar__link" to="/editors">Editors</Link>
      </div>
      <div>
        {isLoggedIn ? (
          <button className="navbar__button" onClick={logout}>Logout</button>
        ) : (
          <Link to="/login">
            <button className="navbar__button">Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
