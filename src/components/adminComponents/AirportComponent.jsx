import React, { useState, useEffect } from "react";
import { AddAirport, DeleteAirport, GetAirports } from "../../api/Airport";

const AirportComponent = () => {
  const [airports, setAirports] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [newAirport, setNewAirport] = useState({
    AirportId: "",
    City: "",
    AirportName: "",
    State: "",
  });

  useEffect(() => {
    GetAirports().then((res) => {
      setAirports(res);
    });
  }, [refresh]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAirport({ ...newAirport, [name]: value });
  };

  const handleAddAirport = () => {
    AddAirport(newAirport).then(() => {
      setRefresh(!refresh);
      setNewAirport({
        AirportId: "",
        City: "",
        AirportName: "",
        State: "",
      });
    });
  };

  const handleDeleteAirport = (id) => {
    DeleteAirport(id).then(() => {
      setAirports(airports.filter((airport) => airport.AirportId !== id));
      setRefresh(!refresh);
    });
  };

  return (
    <div className="mx-auto p-6 bg-[#990011]">
      <h2 className="text-2xl font-bold mb-4 text-center bg-[#FCF6F5] p-2 rounded-md">Admin Dashboard</h2>

        <div className="bg-[#FCF6F5] p-10 mb-5 rounded-xl">
        <h3 className="text-2xl p-2 font-bold mb-2 ">Airports</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Airport ID</th>
              <th className="border border-gray-300 px-4 py-2">Airport Name</th>
              <th className="border border-gray-300 px-4 py-2">City</th>
              <th className="border border-gray-300 px-4 py-2">State</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {airports.map((airport) => (
              <tr key={airport.AirportId} className="bg-white">
                <td className="border border-gray-300 px-4 py-2">
                  {airport.AirportId}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {airport.AirportName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {airport.City}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {airport.State}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleDeleteAirport(airport.AirportId)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-6 bg-[#FCF6F5] p-10 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Add New Airport</h3>
        <input
          type="text"
          placeholder="Airport ID"
          name="AirportId"
          value={newAirport.AirportId}
          onChange={handleInputChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded mb-2 focus:outline-none"
        />
        <input
          type="text"
          placeholder="City"
          name="City"
          value={newAirport.City}
          onChange={handleInputChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded mb-2 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Airport Name"
          name="AirportName"
          value={newAirport.AirportName}
          onChange={handleInputChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded mb-2 focus:outline-none"
        />
        <input
          type="text"
          placeholder="State"
          name="State"
          value={newAirport.State}
          onChange={handleInputChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded mb-2 focus:outline-none"
        />
        <button
          onClick={handleAddAirport}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
          Add Airport
        </button>
      </div>
    
    </div>
  );
};

export default AirportComponent;
