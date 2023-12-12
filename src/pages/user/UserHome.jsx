import React, { useState, useEffect } from "react";
import {
  AddScheduleForMonths,
  DeleteSchedules,
  GetAllFlightSchedules,
  GetConnectingFlightSchedule,
  GetDirectFlightSchedule,
} from "../../api/FlightSchedules";
import { GetFlightDetails } from "../../api/FlightDetails";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { GetAirports } from "../../api/Airport";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TimePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Link, useNavigate } from "react-router-dom";

const UserHome = () => {
  const [flightSchedules, setFlightSchedules] = useState([]);
  const [flights, setFlights] = useState([]);
  const [directFlights, setDirectFlights] = useState([]);
  const [finalConnectingFlights, setFinalConnectingFlights] = useState([]);
  const [date, setDate] = useState("");
  const [airports, setAirports] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedScheduleIds, setSelectedScheduleIds] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const navigate = useNavigate();
  const [newSchedule, setNewSchedule] = useState({
    flightName: "",
    sourceAirportId: "",
    destinationAirportId: "",
    flightDuration: "",
    dateTime: null,
  });

  const [filters, setFilters] = useState({
    source: "",
    destination: "",
    date: "",
  });

  const [bookingType, setBookingType] = useState("");

  useEffect(() => {
    // Fetch flight schedules, airports, and flights data
    GetAllFlightSchedules().then((res) => {
      setFlightSchedules(res);
      setFilteredSchedules(res); // Initialize filteredSchedules with all schedules
    });

    GetAirports().then((res) => {
      setAirports(res);
    });

    GetFlightDetails().then((res) => {
      setFlights(res);
    });
  }, [refresh]);

  const searchFlightSchedules = async () => {
    setDirectFlights([]);
    setFinalConnectingFlights([]);

    GetDirectFlightSchedule(
      filters.source,
      filters.destination,
      filters.date
    ).then((res) => {
      setDirectFlights(res);
      console.log(res);
    });

    const connectingFlights = await GetConnectingFlightSchedule(
      filters.source,
      filters.destination,
      filters.date
    );

    if (connectingFlights && connectingFlights.length > 0) {
      const connectedFlights = await Promise.all(
        connectingFlights.map(async (firstFlight) => {
          const connectedFlight = await GetDirectFlightSchedule(
            firstFlight.DestinationAirportId,
            filters.destination,
            firstFlight.DateTime
          );

          if (connectedFlight) {
            return {
              FirstFlight: firstFlight,
              SecondFlight: connectedFlight,
            };
          }
          return null;
        })
      );

      const filteredConnectedFlights = connectedFlights.filter(
        (flight) => flight !== null
      );

      setFinalConnectingFlights(filteredConnectedFlights);
      console.log(filteredConnectedFlights);
    }
  };

  const handleCheckboxChange = (type) => {
    setBookingType(type);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "date" && value) {
      const selectedDate = new Date(value);
      const formattedDateTime = selectedDate.toISOString();
      setDate(formattedDateTime.split(".")[0]);
      setFilters({ ...filters, [name]: value });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const applyFilters = () => {
    const { date, source, destination } = filters;
    const filtered = flightSchedules.filter((schedule) => {
      const dateMatch =
        !date || schedule.DateTime.includes(date) || date === "";

      const sourceMatch = schedule.SourceAirportId === source || source === "";

      const destinationMatch =
        schedule.DestinationAirportId === destination || destination === "";

      return dateMatch && sourceMatch && destinationMatch;
    });
    setFilteredSchedules(filtered);
  };

  const resetFilters = () => {
    setFilters({
      source: "",
      destination: "",
      date: "",
    });
    setFilteredSchedules(flightSchedules);
  };

  const handleFlightClick = (flight,mode) => {
    const flightDetails = JSON.stringify(flight);
    sessionStorage.setItem('directflight', flightDetails);
    navigate(`/FlightBookingDetail/${mode}`)
  };
  const handleConnectingFlightClick = (firstflight,secondflight,mode) => {
    const connectingFlights = {
      firstflight,
      secondflight
    }
    console.log(connectingFlights)
    const connectingFlightDetails = JSON.stringify(connectingFlights);
    console.log(connectingFlightDetails)
    sessionStorage.setItem('connectingFlights', connectingFlightDetails);
    navigate(`/FlightBookingDetail/${mode}`)
  };
  return (
    <div className="flex flex-col p-5 w-full justify-center items-center">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-row gap-2">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-500"
            checked={bookingType === "oneway"}
            onChange={() => handleCheckboxChange("oneway")}
          />
          <p>One Way</p>
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-500"
            checked={bookingType === "roundtrip"}
            onChange={() => handleCheckboxChange("roundtrip")}
          />
          <p>Roundtrip</p>
        </div>
        <div className="flex flex-row gap-2">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="demo-simple-select-label">From</InputLabel>
            <Select
              value={filters.source}
              onChange={handleFilterChange}
              name="source"
              label="From"
            >
              <MenuItem value="" disabled>
                Choose a Source
              </MenuItem>
              {airports.map((airport) => (
                <MenuItem key={airport.AirportId} value={airport.AirportId}>
                  {airport.City}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="demo-simple-select-label">To</InputLabel>
            <Select
              value={filters.destination}
              onChange={handleFilterChange}
              name="destination"
              label="To"
            >
              <MenuItem value="" disabled>
                Choose a Destination
              </MenuItem>
              {airports.map((airport) => (
                <MenuItem key={airport.AirportId} value={airport.AirportId}>
                  {airport.City}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Departure Date"
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
          />

          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-medium rounded p-2"
            onClick={() => {
              applyFilters();
              searchFlightSchedules();
            }}
          >
            Search Flights
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-medium rounded p-2"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </div>
      <h1>DirectFlights</h1>
      <div className="m-5">
        <ul>
          {directFlights.map((flight) => (
            
              <li
                key={flight.ScheduleId}
                className="flex items-center border-b py-2 border border-1 p-6 m-4 hover:cursor-pointer"
                onClick={() => handleFlightClick(flight,"singleTrip")}
              >
                <p className="flex items-center space-x-2">
                  <span>{flight.FlightName}</span>
                </p>
                {flight.SourceAirportId} - {flight.DestinationAirportId} -{" "}
                {flight.FlightDuration} - {flight.DateTime}
              </li>
          ))}
        </ul>
      </div>
      <h1>ConnectingFlights</h1>
      <div className="m-5">
        {finalConnectingFlights.map((connection, index) => (
          <div key={index} className="flex justify-between">
            <div className="">
              {connection.SecondFlight.map((flight, i) => (
                <div key={i} className="flex flex-row-reverse border p-2 hover:cursor-pointer m-5"
                 onClick={() => handleConnectingFlightClick(flight,connection.FirstFlight,"connectingTrip")}>
                  <div className="p-5">
                    <ul>
                      <li>{flight.FlightName}</li>
                      <li>{flight.SourceAirportId}</li>
                      <li>
                        {flight.DestinationAirportId}
                      </li>
                      <li>Flight Duration: {flight.FlightDuration}</li>
                      <li>DepartureDate: {flight.DateTime.split("T")[0]}</li>
                      <li>DepartureTime: {flight.DateTime.split("T")[1]}</li>
                    </ul>
                  </div>
                  <div className="p-5">
                    <ul>
                      <li>{connection.FirstFlight.FlightName}</li>
                      <li>
                        {connection.FirstFlight.SourceAirportId}
                      </li>
                      <li>
                        
                        {connection.FirstFlight.DestinationAirportId}
                      </li>
                      <li>
                        Flight Duration: {connection.FirstFlight.FlightDuration}
                      </li>
                      <li>DepartureDate: {connection.FirstFlight.DateTime.split("T")[0]}</li>
                      <li>DepartureTime: {connection.FirstFlight.DateTime.split("T")[1]}</li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHome;
