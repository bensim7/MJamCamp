import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";

const NavBar = () => {
  return (
    <header className={styles.navbar}>
      <nav>
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
              to="/Writesong"
              className={(navData) => (navData.isActive ? styles.active : "")}
            >
              Write Song
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
              to="/Matches"
              className={(navData) => (navData.isActive ? styles.active : "")}
            >
              Matches
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
