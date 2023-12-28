import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const Layout = ({ children }) => {
  const user = useSelector((state) => state.user.user);

  const navigate = useNavigate();


  return (
    <div>
      <Header />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
