// FlightComponent.js
import React, { useEffect, useState } from 'react';
import { GetFlightDetails, UpdateFlight } from '../../api/FlightDetails';

const FlightComponent = () => {
  const [flightDetails, setFlightDetails] = useState([]);
  const [editingFlight, setEditingFlight] = useState("");
  const [refresh, setRefresh] = useState(false);

  const [updatedFlightDetails, setUpdatedFlightDetails] = useState({
    FlightCapacity: 0,
    IsActive: false,
  });

  useEffect(() => {
    fetchFlightDetails();
  }, [refresh]);

  const fetchFlightDetails =() => {
    try {
      GetFlightDetails().then((res)=>{
        setFlightDetails(res);
      });
    } catch (error) {
      console.error('Error fetching flight details:', error);
    }
  };

  const handleEditFlight = (flight) => {
    console.log(flight)
    const id = flight.FlightName
    console.log(id)
    setEditingFlight(id);
    setUpdatedFlightDetails({
      FlightCapacity: flight.FlightCapacity,
      IsActive: flight.IsActive,
    });
  };

  const handleUpdateFlight = () => {
    try {
      console.log(editingFlight, updatedFlightDetails)
      UpdateFlight(editingFlight, updatedFlightDetails).then((res)=>{
        console.log(res)
        setRefresh(!refresh);
        setEditingFlight(null);
      });
    } catch (error) {
      console.error('Error updating flight:', error);
    }
  };

  return (
    <div>
      <h2>Flight Details</h2>
      <table>
        <thead>
          <tr>
            <th>Flight Name</th>
            <th>Flight Capacity</th>
            <th>Active</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {flightDetails.map((flight) => (
            <tr key={flight.id}>
              <td>{flight.FlightName}</td>
              <td>{flight.FlightCapacity}</td>
              <td>{flight.IsActive ? 'Active' : 'Inactive'}</td>
              <td>
                <button onClick={() => handleEditFlight(flight)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingFlight && (
        <div>
          <h3>Edit Flight</h3>
          <input
            type="number"
            value={updatedFlightDetails.FlightCapacity}
            onChange={(e) =>
              setUpdatedFlightDetails({
                ...updatedFlightDetails,
                FlightCapacity: parseInt(e.target.value),
              })
            }
          />
          <input
            type="checkbox"
            checked={updatedFlightDetails.IsActive}
            onChange={(e) =>
              setUpdatedFlightDetails({
                ...updatedFlightDetails,
                IsActive: e.target.checked,
              })
            }
          />
          <button onClick={handleUpdateFlight}>Confirm Update</button>
        </div>
      )}
    </div>
  );
};

export default FlightComponent;
