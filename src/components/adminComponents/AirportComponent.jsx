import React from 'react'
import axios from "axios";
import { AddAirport, DeleteAirport, GetAirports } from "../../api/Airport";
const AirportComponent = () => {
    const [airports, setAirports] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [newAirport, setNewAirport] = useState({
      AirportId: "",
      City: "",
      AirportName: "",
      State: ""
    });
  
    useEffect(() => {
      GetAirports().then((res)=>{
        console.log(res)
        setAirports(res)
      })
    }, [refresh]);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewAirport({ ...newAirport, [name]: value });
    };
  
    const handleAddAirport = () => {
      AddAirport(newAirport).then((res)=>{
        console.log(res)
        setRefresh(!refresh);
      })
  
    };
  
    const handleDeleteAirport = (id) => {
      DeleteAirport(id).then(() => {
        setAirports(airports.filter((airport) => airport.airportId !== id));
        setRefresh(!refresh);
      });
    };
  
    return (
      <div>
        <h2>Admin Dashboard</h2>
        <div>
          <h3>Add New Airport</h3>
          <input
            type="text"
            placeholder="Airport ID"
            name="AirportId"
            value={newAirport.AirportId}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="City"
            name="City"
            value={newAirport.City}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="Airport Name"
            name="AirportName"
            value={newAirport.AirportName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="State"
            name="State"
            value={newAirport.State}
            onChange={handleInputChange}
          />
          <button onClick={handleAddAirport}>Add Airport</button>
        </div>
        <div>
          <h3>Airports List</h3>
          <ul>
            {airports.map((airport) => (
              <li key={airport.AirportId}>
                {airport.AirportId} - {airport.AirportName} - {airport.City} - {airport.State}
                <button onClick={() => handleDeleteAirport(airport.AirportId)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
}

export default AirportComponent