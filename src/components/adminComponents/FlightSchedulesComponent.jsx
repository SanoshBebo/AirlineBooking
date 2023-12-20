import React, { useState, useEffect } from "react";
import {
  AddScheduleForMonths,
  DeleteSchedules,
  GetAllFlightSchedules,
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ToastContainer, toast } from "react-toastify";

const FlightSchedulesComponent = () => {
  const [flightSchedules, setFlightSchedules] = useState([]);
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedScheduleIds, setSelectedScheduleIds] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [filters, setFilters] = useState({
    flightName: "",
    date: "",
    source: "",
    destination: "",
  });
  const [newSchedule, setNewSchedule] = useState({
    flightName: "",
    sourceAirportId: "",
    destinationAirportId: "",
    flightDuration: "",
    dateTime: null,
  });

  const [months, setMonths] = useState(1);
  const [monthsList, setMonthsList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule({ ...newSchedule, [name]: value });
  };

  const handleCheckboxChange = (e, scheduleId) => {
    const { checked } = e.target;
    if (checked) {
      setSelectedScheduleIds((prevState) => [...prevState, scheduleId]);
    } else {
      setSelectedScheduleIds((prevState) =>
        prevState.filter((id) => id !== scheduleId)
      );
    }
  };

  const handleDeleteSelectedSchedules = () => {
    if (selectedScheduleIds.length > 0) {
      DeleteSchedules(selectedScheduleIds).then(() => {
        setFlightSchedules((prevSchedules) =>
          prevSchedules.filter(
            (schedule) => !selectedScheduleIds.includes(schedule.ScheduleId)
          )
        );
        setSelectedScheduleIds([]);
        setRefresh(!refresh);
      });
    }
  };

  const handleAddSchedule = (schedule, months) => {
    console.log(schedule);
    console.log(months);
    AddScheduleForMonths(schedule, months).then((res) => {
      console.log(res);
      toast.success("Flight has been Scheduled!");
      // setNewSchedule({
      //   flightName: "",
      //   sourceAirportId: "",
      //   destinationAirportId: "",
      //   flightDuration: "",
      //   dateTime: null,
      // });
      setRefresh(!refresh);
    }).catch((err)=>{
      console.error(err);
    });
  };

  const handleFlightDurationChange = (value) => {
    const selectedTime = value ? value.format("HH:mm:ss") : ""; // Format time to HH:mm:ss
    console.log(selectedTime);
    setNewSchedule((prevState) => ({
      ...prevState,
      flightDuration: selectedTime, // Set the flightDuration to selected time in hh:mm:ss format
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    const { flightName, date, source, destination } = filters;
    const filtered = flightSchedules.filter((schedule) => {
      const flightNameMatch =
        schedule.FlightName.toLowerCase().includes(flightName.toLowerCase()) ||
        flightName === "";

      const dateMatch =
        !date || schedule.DateTime.includes(date) || date === "";

      const sourceMatch = schedule.SourceAirportId === source || source === "";

      const destinationMatch =
        schedule.DestinationAirportId === destination || destination === "";

      return flightNameMatch && dateMatch && sourceMatch && destinationMatch;
    });
    setFilteredSchedules(filtered);
  };

  const resetFilters = () => {
    setFilters({
      flightName: "",
      date: "",
      source: "",
      destination: "",
    });
    setFilteredSchedules(flightSchedules);
  };

  return (
    <div className="p-8 bg-[#990011]">
      <h1 className="text-3xl font-bold mb-6 text-[#FCF6F5] ">
        Flight Schedules
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-[#FCF6F5] flex-col flex rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#990011]">
            Add New Schedule
          </h2>
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Flight
            </InputLabel>
            <Select
              className="bg-white"
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={newSchedule.flightName}
              name="flightName"
              onChange={handleChange}
              autoWidth
              label="Flight"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {flights.map((flight) => (
                <MenuItem key={flight.FlightId} value={flight.FlightName}>
                  {flight.FlightName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel
              id="demo-simple-select-autowidth-label"
              className="bg-white"
            >
              Source Airport
            </InputLabel>
            <Select
              className="bg-white"
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={newSchedule.SourceAirportId}
              onChange={handleChange}
              name="sourceAirportId"
              autoWidth
              label="Source Airport"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {airports.map((airport) => (
                <MenuItem key={airport.AirportId} value={airport.AirportId}>
                  {airport.AirportName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel
              className="bg-white"
              id="demo-simple-select-autowidth-label"
            >
              Destination Airport
            </InputLabel>
            <Select
              className="bg-white"
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={newSchedule.DestinationAirportId}
              onChange={handleChange}
              autoWidth
              name="destinationAirportId"
              label="Destination Airport"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {airports.map((airport) => (
                <MenuItem key={airport.AirportId} value={airport.AirportId}>
                  {airport.AirportName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id="demo-simple-select-label">Months</InputLabel>
            <Select
              className="bg-white"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={months}
              label="months"
              onChange={(e) => {
                setMonths(e.target.value);
              }}
            >
              {monthsList.map((month, index) => (
                <MenuItem key={index} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                className="bg-white"
                label="Departure Date and Time"
                value={newSchedule.dateTime}
                onChange={(newValue) => {
                  const formattedDateTime = newValue.format(
                    "YYYY-MM-DDTHH:mm:ss"
                  );
                  console.log(formattedDateTime);
                  setNewSchedule({
                    ...newSchedule,
                    dateTime: formattedDateTime,
                  });
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                className="bg-white"
                label="Flight Duration"
                value={newSchedule.flightDuration} // Use the same dateTime state for TimePicker
                onChange={(newValue) => handleFlightDurationChange(newValue)}
                renderInput={(params) => <TextField {...params} />}
                ampm={false} // Use 24-hour format
              />
            </LocalizationProvider>
          </FormControl>
          <button
            className="bg-[#990011] hover:bg-[#a8192a] text-white font-bold py-2 px-4 rounded mt-4"
            onClick={() => handleAddSchedule(newSchedule, months)}
          >
            Add Schedule
          </button>
        </div>

        <div className="bg-[#FCF6F5] flex-col flex rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Filter Options</h2>
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <TextField
              className="bg-white"
              label="Filter by Flight Name"
              name="flightName"
              value={filters.flightName}
              onChange={handleFilterChange}
            />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <TextField
              className="bg-white"
              label="Filter by Date"
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id="demo-simple-select-label">
              Filter by Source
            </InputLabel>
            <Select
              className="bg-white"
              value={filters.source}
              onChange={handleFilterChange}
              name="source"
              label="Filter by Source"
            >
              <MenuItem value="">All Sources</MenuItem>
              {airports.map((airport) => (
                <MenuItem key={airport.AirportId} value={airport.AirportId}>
                  {airport.AirportName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id="demo-simple-select-label">
              Filter by Destination
            </InputLabel>
            <Select
              className="bg-white"
              value={filters.destination}
              onChange={handleFilterChange}
              name="destination"
              label="Filter by Destination"
            >
              <MenuItem value="">All Destinations</MenuItem>
              {airports.map((airport) => (
                <MenuItem key={airport.AirportId} value={airport.AirportId}>
                  {airport.AirportName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <button
            onClick={applyFilters}
            className="bg-[#990011] hover:bg-[#a8192a] text-white font-bold py-2 px-4 rounded mt-4"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="bg-[#990011] hover:bg-[#a8192a] text-white font-bold py-2 px-4 rounded mt-4"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Filtered Schedules</h2>
        <ul>
          {filteredSchedules.map((schedule) => (
            <li
              key={schedule.ScheduleId}
              className="flex items-center justify-between border-b py-2"
            >
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={(e) => handleCheckboxChange(e, schedule.ScheduleId)}
                  checked={selectedScheduleIds.includes(schedule.ScheduleId)}
                  className="form-checkbox h-5 w-5 text-blue-500"
                />
                <span>{schedule.FlightName}</span>
              </label>
              {schedule.FlightName} - {schedule.SourceAirportId} -{" "}
              {schedule.DestinationAirportId} - {schedule.FlightDuration} -{" "}
              {schedule.DateTime}
            </li>
          ))}
        </ul>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={handleDeleteSelectedSchedules}
        >
          Delete Selected Schedules
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FlightSchedulesComponent;
