import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import logoImg from '../assets/logo.png';
import dashboardImg from '../assets/dashboard.png';
import analyticsImg from '../assets/analytics.png';
import settingsImg from '../assets/settings.png';
import logoutImg from '../assets/logout.png';

import styles from '../styles/Navbar.module.scss';
import toast from "react-hot-toast";
import ChoiceModel from "../common-components/ChoiceModel";

const Navbar = () => {
  const [isLogoutModelOpen, setIsLogoutModelOpen] = useState(false);

  let location = useLocation();
  location = location?.pathname;
  location = location?.split("/");
  location = location?.[2];
  const [currentTab, setCurrentTab] = useState(location);

  const navigate = useNavigate();

  // console.log("currentTab: ", currentTab);

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("allTodos");

    toast.success("Logged out!");
    setIsLogoutModelOpen(false);
    navigate('/login');
  };

  const handleTabClick = (value) => {
    if (value === "dashboard") {
      setCurrentTab(value);
      navigate("/home/dashboard");
    }
    else if (value === "analytics") {
      setCurrentTab(value);
      navigate("/home/analytics");
    }
    else if (value === "settings") {
      setCurrentTab(value);
      navigate("/home/settings");
    }
  };

  const NAV_ITEMS = [
    {
      name: "Dashboard",
      image: dashboardImg
    },
    {
      name: "Analytics",
      image: analyticsImg
    },
    {
      name: "Settings",
      image: settingsImg
    },
  ];

  const navBox = (navValue, selectedItem, image, handleTabClick, key) => {
    return (
      <button key={key} className={`${selectedItem === navValue.toLowerCase() ? styles.bold : styles.default}`} onClick={(e) => handleTabClick(navValue.toLowerCase())}>
        <img src={image} alt="image" />
        <div
        // className={`${selectedItem === navValue.toLowerCase() ? styles.bold : styles.default}`}
        >
          {navValue}</div>
      </button>
    );
  };

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.logoContainer}>
        <img src={logoImg} alt="Logo" />
        <div>Pro Manage</div>
      </div>

      <div className={styles.body}>
        <div className={styles.navList}>
          {NAV_ITEMS?.map((nav, index) => {
            return (
              navBox(nav.name, currentTab, nav.image, handleTabClick, index)
            );
          })}
        </div>

        <div className={styles.logout} onClick={() => setIsLogoutModelOpen(true)}>
          <img src={logoutImg} alt="logout image" />
          <div>Log out</div>
        </div>
      </div>

      {isLogoutModelOpen &&
        <ChoiceModel 
          message = "Are you sure you want to Logout?"
          firstBtnText = "Yes, Logout"
          secondBtnText = "Cancel"
          onConfirm = {handleLogoutClick}
          onClose = {() => setIsLogoutModelOpen(false)}
        />
      }

    </div>
  );
};

export default Navbar;