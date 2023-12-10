import { Button } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-zinc-950 p-3">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-l md:text-2xl lg:text-3xl  font-bold">Business Reports</h1>
        <div className="space-x-4">
          {user && (
            <>
              <Button  onClick={handleBack} variant="contained" color="inherit">
                Back
              </Button>
              <Button onClick={handleSignOut} variant="contained" color="inherit">
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
