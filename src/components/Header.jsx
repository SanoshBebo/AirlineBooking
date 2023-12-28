import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const user = useSelector((state) => state.user.user);
  const [userData, setUserData] = useState([])
  const navigate = useNavigate();
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

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

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUserData(userData);
      setIsUserSignedIn(true);
    }
  }, []);

  return (
    <div className="bg-red-500 p-3">
      <div className="container mx-auto flex justify-between items-center">
        <h1
          className="text-white text-sm  md:text-xl lg:text-2xl  font-bold hover:cursor-pointer"
          onClick={() => navigate("/userhome")}
        >
          Red Sparrow
        </h1>
        <div className="space-x-4 text-white">
          {isUserSignedIn ? (
            <div className="space-x-4 text-white">
              {userData.Role == "user" && (
                <button
                  className=""
                  onClick={() => navigate("/BookingHistory")}
                  variant="contained"
                  color="inherit"
                >
                  Booking History
                </button>
              )}
              <button onClick={handleBack} variant="contained" color="inherit">
                Back
              </button>
              <button
                className="cursor-pointer hover:underline"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-x-4 text-white">
              <button onClick={handleBack} variant="contained" color="inherit">
                Back
              </button>
              <button
                className="cursor-pointer hover:underline"
                onClick={handleSignIn}
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
