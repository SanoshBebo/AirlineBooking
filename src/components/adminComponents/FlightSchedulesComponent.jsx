import React, { useState, useEffect } from "react";
import {
  AddScheduleForMonths,
  DeleteSchedules,
  GetAllFlightSchedules,
} from "../../api/FlightSchedules";
import { GetFlightDetails } from "../../api/FlightDetails";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { GetAirports } from "../../api/Airport";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TimePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const FlightSchedulesComponent = () => {
  const [flightSchedules, setFlightSchedules] = useState([]);
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [refresh, setRefresh] = useState(false);

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
    GetAllFlightSchedules().then((res) => {
      console.log(res);
      setFlightSchedules(res);
    });

    GetAirports().then((res) => {
      console.log(res);
      setAirports(res);
    });

    GetFlightDetails().then((res) => {
      console.log(res);
      setFlights(res);
    });
  }, [refresh]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule({ ...newSchedule, [name]: value });
  };

  const handleDeleteSchedule = (id) => {
    DeleteSchedules(id).then(() => {
      setFlightSchedules(
        flightSchedules.filter((flight) => flight.ScheduleId !== id)
      );
      setRefresh(!refresh);
    });
  };

  const handleAddSchedule = (schedule, months) => {
    console.log(schedule)
    console.log(months)
    AddScheduleForMonths(schedule, months).then((res) => {
      console.log(res);
      setRefresh(!refresh);
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

  return (
    <div>
      <div>
        <h3>FlightSchedules </h3>
        <div>
          <h3>Add New Schedule</h3>
          <FormControl sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Flight
            </InputLabel>
            <Select
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
          <FormControl sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Source Airport
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={newSchedule.SourceAirportId}
              onChange={handleChange}
              name="sourceAirportId"
              autoWidth
              label="Source"
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
          <FormControl sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Destination Airport
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={newSchedule.DestinationAirportId}
              onChange={handleChange}
              autoWidth
              name="destinationAirportId"
              label="Destination"
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
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              No Of Months To Schedule
            </InputLabel>
            <Select
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Select Date and Time"
              value={newSchedule.dateTime}
              onChange={(newValue) => {
                const formattedDateTime = newValue.format(
                  "YYYY-MM-DDTHH:mm:ss"
                );
                console.log(formattedDateTime)
                setNewSchedule({ ...newSchedule, dateTime: formattedDateTime });
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>

            <TimePicker
              label="Flight Duration"
              value={newSchedule.flightDuration} // Use the same dateTime state for TimePicker
              onChange={(newValue) => handleFlightDurationChange(newValue)}
              renderInput={(params) => <TextField {...params} />}
              ampm={false} // Use 24-hour format
            />
          </LocalizationProvider>
          <button onClick={() => handleAddSchedule(newSchedule, months)}>
            Add Airport
          </button>
        </div>
        <ul>
          {flightSchedules.map((schedule) => (
            <li key={schedule.ScheduleId}>
              {schedule.FlightName} - {schedule.SourceAirportId} -{" "}
              {schedule.DestinationAirportId} - {schedule.FlightDuration}
              {schedule.DateTime}
              <button onClick={() => handleDeleteSchedule(schedule.ScheduleId)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FlightSchedulesComponent;
