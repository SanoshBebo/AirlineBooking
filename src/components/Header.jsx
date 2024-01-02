import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation } from "react-router-dom";

const Header = () => {
  const user = useSelector((state) => state.user.user);
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const [loginPage, setLoginPage] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleSignOut = () => {
    localStorage.clear("");
    sessionStorage.clear("");
    navigate("/login");
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUserData(userData);
      setIsUserSignedIn(true);
    }

    if (location.pathname === "/login") {
      setLoginPage(true);
    } else {
      setLoginPage(false);
    }
  }, [location.pathname]);

  return (
    <div className="bg-red-500 p-3">
      <div className="container mx-auto flex justify-between items-center">
        <h1
          className="text-white text-sm md:text-xl lg:text-2xl font-bold hover:cursor-pointer"
          onClick={() => navigate("/userhome")}
        >
          Red Sparrow
        </h1>
        {!loginPage && (
          <div className="space-x-4 text-white">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuClick}
              size="large"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  handleBack();
                }}
              >
                Back
              </MenuItem>
              {isUserSignedIn ? (
                <div>
                  {userData.Role === "user" && (
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/BookingHistory");
                      }}
                    >
                      Booking History
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      handleSignOut();
                    }}
                  >
                    Sign Out
                  </MenuItem>
                </div>
              ) : (
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleSignIn();
                  }}
                >
                  Sign In
                </MenuItem>
              )}
            </Menu>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
