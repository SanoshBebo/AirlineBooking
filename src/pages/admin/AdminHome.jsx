import React, { useState, useEffect } from "react";
import FlightComponent from "../../components/adminComponents/FlightComponent";
import FlightSchedulesComponent from "../../components/adminComponents/FlightSchedulesComponent";
import AirportComponent from "../../components/adminComponents/AirportComponent";
import { Authenticate } from "../../helper_functions/Authenticator";
import { useNavigate } from "react-router";

const AdminHome = () => {
  const navigate = useNavigate()
  
  useEffect(() => {
    if(!Authenticate("admin")){
      navigate("/login")
    }
  }, [])
  
  return (
    <div>
      <AirportComponent />
      <FlightComponent />
      <FlightSchedulesComponent />
    </div>
  );
};

export default AdminHome;
