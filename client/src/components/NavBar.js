import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";
import ReactContext from "../context/react.context";

const NavBar = () => {
  // Moved NavBar out of App.js header to below App.js header.
  // Log out button moved from App.js header to NavBar via useContext for better mobile screen display through Media Query
  const reactCtx = useContext(ReactContext);
  return (
    <header className={styles.navbar}>
      <nav class>
        <ul>
          <li>
            <NavLink
              to="/Login"
              className={(navData) => (navData.isActive ? styles.active : "")}
            >
              Log In
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/Createsong"
              className={(navData) => (navData.isActive ? styles.active : "")}
            >
              Enter Song
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Searchsong"
              className={(navData) => (navData.isActive ? styles.active : "")}
            >
              Song Search
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Usermatch"
              className={(navData) => (navData.isActive ? styles.active : "")}
            >
              User Match
            </NavLink>
          </li>
          <li>
            <button
              className="btn btn-outline-light logOut"
              onClick={reactCtx.logOut}
            >
              Log Out
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
