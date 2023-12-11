import React, { useEffect, useState } from 'react';
import { AddFlight, GetFlightDetails, UpdateFlight } from '../../api/FlightDetails';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FlightComponent = () => {
  const [flightDetails, setFlightDetails] = useState([]);
  const [editingFlight, setEditingFlight] = useState("");
  const [editing, setEditing] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [updatedFlightDetails, setUpdatedFlightDetails] = useState({
    FlightCapacity: 0,
    IsActive: false,
  });

  const [newFlightDetails, setNewFlightDetails] = useState({
    FlightCapacity: 0,
    IsActive: false,
  });

  useEffect(() => {
    fetchFlightDetails();
  }, [refresh]);

  const fetchFlightDetails = () => {
    try {
      GetFlightDetails().then((res) => {
        setFlightDetails(res);
      });
    } catch (error) {
      console.error('Error fetching flight details:', error);
    }
  };

  const handleAddFlight = () => {
    if(newFlightDetails.FlightCapacity < 1000 && newFlightDetails.FlightCapacity >= 2){
      try {
        AddFlight(newFlightDetails).then((res) => {
          console.log(res);
          setRefresh(!refresh);
          setNewFlightDetails({
            FlightCapacity: 0,
            IsActive: false,
          })
          toast.success("Flight Added !", {
            position: toast.POSITION.TOP_RIGHT,
          });
        });
      } catch (error) {
        console.error('Error adding flight:', error);
      }
    }
    else{
      toast.error("Invalid Seat Count (2-1000)", {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  };

  const handleEditFlight = (flight) => {
    const id = flight.FlightName;
    setEditing(!editing);
    setEditingFlight(id);
    setUpdatedFlightDetails({
      FlightCapacity: flight.FlightCapacity,
      IsActive: flight.IsActive,
    });
  };

  const handleUpdateFlight = () => {
    if(updatedFlightDetails.FlightCapacity < 1000 && updatedFlightDetails.FlightCapacity >= 2){
    try {
      UpdateFlight(editingFlight, updatedFlightDetails).then((res) => {
        console.log(res);
        setRefresh(!refresh);
        setEditingFlight(null);
      });
    } catch (error) {
      console.error('Error updating flight:', error);
    }
  }
  else{
    toast.error("Invalid Seat Count (2-1000)", {
      position: toast.POSITION.TOP_RIGHT,
    })
  }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Flight Details</h2>
      <table className="w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Flight Name</th>
            <th className="border border-gray-300 px-4 py-2">Flight Capacity</th>
            <th className="border border-gray-300 px-4 py-2">Active</th>
            <th className="border border-gray-300 px-4 py-2">Edit</th>
          </tr>
        </thead>
        <tbody>
          {flightDetails.map((flight) => (
            <tr key={flight.id} className="bg-white">
              <td className="border border-gray-300 px-4 py-2">{flight.FlightName}</td>
              <td className="border border-gray-300 px-4 py-2">{flight.FlightCapacity}</td>
              <td className="border border-gray-300 px-4 py-2">{flight.IsActive ? 'Active' : 'Inactive'}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button onClick={() => handleEditFlight(flight)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mb-6 flex-row items-center justify-start ">
        <h3 className="text-lg font-semibold mb-2">Add Flight</h3>
        <div className='flex'>
        <input
          type="number"
          value={newFlightDetails.FlightCapacity}
          onChange={(e) =>
            setNewFlightDetails({
              ...newFlightDetails,
              FlightCapacity: parseInt(e.target.value),
            })
          }
          className="border border-gray-300 px-3 py-1 mb-2"
          />
        <p className="mr-2">Active</p>
        <input
          id="activeFlight"
          type="checkbox"
          checked={newFlightDetails.IsActive}
          onChange={(e) =>
            setNewFlightDetails({
              ...newFlightDetails,
              IsActive: e.target.checked,
            })
          }
          className="mr-2"
          />
          </div>
        <button onClick={handleAddFlight} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none">
          Confirm Add
        </button>
      </div>
      {editing && editingFlight && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Edit Flight</h3>
          <input
            type="number"
            value={updatedFlightDetails.FlightCapacity}
            onChange={(e) =>
              setUpdatedFlightDetails({
                ...updatedFlightDetails,
                FlightCapacity: parseInt(e.target.value),
              })
            }
            className="border border-gray-300 px-3 py-1 mb-2"
          />
          <label htmlFor="activeEditFlight" className="mr-2">Active</label>
          <input
            id="activeEditFlight"
            type="checkbox"
            checked={updatedFlightDetails.IsActive}
            onChange={(e) =>
              setUpdatedFlightDetails({
                ...updatedFlightDetails,
                IsActive: e.target.checked,
              })
            }
            className="mr-2"
          />
          <button onClick={handleUpdateFlight} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">
            Confirm Update
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default FlightComponent;
