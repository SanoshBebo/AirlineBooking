import React, { useState, useEffect } from "react";
import FlightComponent from "../../components/adminComponents/FlightComponent";
import FlightSchedulesComponent from "../../components/adminComponents/FlightSchedulesComponent";
import AirportComponent from "../../components/adminComponents/AirportComponent";

const AdminHome = () => {
  return (
    <div>
      <AirportComponent />
      <FlightComponent />
      <FlightSchedulesComponent />
    </div>
  );
};

export default AdminHome;
