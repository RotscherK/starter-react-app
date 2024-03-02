import React from 'react';
import { NavLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const { t } = useTranslation();

  // Function to handle logout
  const handleLogout = () => {
    // Perform logout actions (clear token, etc.)
    setIsLoggedIn(false); // Update login status
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink className="navbar-brand" to="/" activeclassname="active-link" exact="true">
          BiteBud
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" activeclassname="active-link" exact="true">
                {t('app.nav.home')}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/menu" activeclassname="active-link">
                {t('app.nav.menus')}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/product" activeclassname="active-link">
                {t('app.nav.products')}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/weekplanner" activeclassname="active-link">
                {t('app.nav.weekplanner')}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/sandbox" activeclassname="active-link">
                {t('app.nav.sandbox')}
              </NavLink>
            </li>
          </ul>
        </div>
        {isLoggedIn ? (
          // Display dropdown if logged in
          <div className={"dropdown"}>
            <button className={"d-flex align-items-center text-white text-decoration-none dropdown-toggle btn btn-dark"} id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="https://github.com/RotscherK.png" alt="" width="32" height="32" className={"rounded-circle me-2"} />
              <strong>Roger</strong>
            </button>
            <ul className={"dropdown-menu dropdown-menu-dark text-small shadow"} aria-labelledby="dropdownUser1">
              <li><button className={"dropdown-item"} href="#">New project...</button></li>
              <li><button className={"dropdown-item"} href="#">
                <NavLink className="nav-link" to="/usersettings" activeclassname="active-link">
                  {t('app.nav.usersettings')}
                </NavLink></button></li>
              <li><button className={"dropdown-item"} href="#">Profile</button></li>
              <li><hr className={"dropdown-divider"} /></li>
              <li><button className={"dropdown-item"} onClick={handleLogout}>Sign out</button></li>
            </ul>
          </div>
        ) : (
          // Display "Sign In" if not logged in
          <NavLink className="nav-link" to="/login">
            Sign In
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
