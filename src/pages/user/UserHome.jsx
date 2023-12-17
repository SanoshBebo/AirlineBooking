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
import { ToastContainer, toast } from "react-toastify";
import { airlinesapi, SanoshAirlineDetails } from "../../components/Constants";
import axios from "axios";
import ConnectionFlightDisplay from "../../components/ConnectionFlightDisplay";
import DirectFlightDisplay from "../../components/DirectFlightDisplay";

const UserHome = () => {
  const [flightSchedules, setFlightSchedules] = useState([]);

  const [flights, setFlights] = useState([]);
  const [directFlights, setDirectFlights] = useState([]);
  const [finalConnectingFlights, setFinalConnectingFlights] = useState([]);
  const [
    finalIntegratedConnectingFlights,
    setFinalIntegratedConnectingFlights,
  ] = useState([]);
  const [finalFirstConnectingFlights, setFinalFirstConnectingFlights] =
    useState([]);
  const [finalSecondConnectingFlights, setFinalSecondConnectingFlights] =
    useState([]);
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
    returndate: "",
  });

  const [bookingType, setBookingType] = useState("");
  const [searched, setSearched] = useState(false);

  const [directFlightsFirstFlight, setDirectFlightsFirstFlight] = useState([]);

  const [connectingFlightsFirstFlight, setConnectingFlightsFirstFlight] =
    useState([]);

  const [directFlightSecondFlight, setDirectFlightSecondFlight] = useState([]);

  const [connectingFlightSecondFlight, setConnectingFlightSecondFlight] =
    useState([]);

  const [roundTripDetails, setRoundTripDetails] = useState([]);

  const firstAirlines = [];
  const secondAirlines = [];

  /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// ///////////////////////////////////////////////
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


  const getIntegratedFlightDetails = async (
    firstAirlines,
    secondAirlines,
    source,
    destination,
    dateTime
  ) => {
    const connectionSchedules = [];
    console.log(firstAirlines,
      secondAirlines,
      source,
      destination,
      dateTime);
    await Promise.all(
      Object.entries(firstAirlines).map(
        async ([firstAirlineName, firstAirline]) => {
          try {
            console.log(firstAirline.apiPath, dateTime);
            const firstResponse = await axios.get(
              `${firstAirline.apiPath}Integration/connectingflight/${source}/${destination}/${dateTime}`
            );
            console.log(firstResponse);
            const firstFlights = firstResponse.data.map((firstFlight) => ({
              ...firstFlight,
              airlineName: firstAirlineName,
              apiPath: firstAirline.apiPath,
            }));
            console.log(firstFlights);

            if (firstFlights && firstFlights.length > 0) {
              await Promise.all(
                firstFlights.map(async (firstFlight) => {
                  await Promise.all(
                    Object.entries(secondAirlines).map(
                      async ([secondAirlineName, secondAirline]) => {
                        console.log(secondAirline);
                        try {
                          const secondResponse = await axios.get(
                            `${secondAirline.apiPath}Integration/directflight/${firstFlight.DestinationAirportId}/${destination}/${firstFlight.DateTime}`
                          );

                          console.log(secondResponse);
                          const secondFlights = secondResponse.data.map(
                            (secondFlight) => ({
                              ...secondFlight,
                              airlineName: secondAirlineName,
                              apiPath: secondAirline.apiPath,
                            })
                          );

                          if (secondFlights && secondFlights.length > 0) {
                            console.log(secondFlights);
                            secondFlights.forEach((secondFlight) => {
                              const connectionSchedule = {
                                FirstFlight: firstFlight,
                                SecondFlight: secondFlights,
                              };
                              console.log(connectionSchedule);
                              connectionSchedules.push(connectionSchedule);
                            });
                          }
                        } catch (error) {
                          console.error(error);
                        }
                      }
                    )
                  );
                })
              );
            }
          } catch (error) {
            console.error(error);
          }
        }
      )
    );
    console.log(connectionSchedules)
    setFinalIntegratedConnectingFlights(connectionSchedules); // Uncomment this line if you want to use this data in your application
  };

  const searchFlightSchedules = async () => {
    setConnectingFlightsFirstFlight([]);
    setConnectingFlightsFirstFlight([]);
    setDirectFlightsFirstFlight([]);
    setDirectFlightSecondFlight([]);
    setDirectFlights([]);
    setSearched(true);

    getIntegratedFlightDetails(
      SanoshAirlineDetails,
      airlinesapi,
      filters.source,
      filters.destination,
      filters.date
    );

    if (bookingType == "oneway" || bookingType == "roundtrip") {
      if (bookingType == "oneway") {
        GetDirectFlightSchedule(
          filters.source,
          filters.destination,
          filters.date
        ).then((res) => {
          setDirectFlights(res);
          console.log(res);
        }).catch((err)=>{
          console.error(err);
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
      } else if (bookingType == "roundtrip") {
        GetDirectFlightSchedule(
          filters.source,
          filters.destination,
          filters.date
        ).then((res) => {
          setDirectFlightsFirstFlight(res);
          console.log(res);
        });

        GetDirectFlightSchedule(
          filters.destination,
          filters.source,
          filters.returndate
        ).then((res) => {
          setDirectFlightSecondFlight(res);
          console.log(res);
        });

        const firstconnectingFlights = await GetConnectingFlightSchedule(
          filters.source,
          filters.destination,
          filters.date
        );


        console.log(firstconnectingFlights)
        const secondconnectingFlights = await GetConnectingFlightSchedule(
          filters.destination,
          filters.source,
          filters.returndate
          );
  
        console.log(secondconnectingFlights)
        if (firstconnectingFlights && firstconnectingFlights.length > 0) {
          const firstconnectedFlights = await Promise.all(
            firstconnectingFlights.map(async (firstFlight) => {
              try {
                const connectedFlight = await GetDirectFlightSchedule(
                  firstFlight.DestinationAirportId,
                  filters.destination,
                  firstFlight.DateTime
                );
        
                console.log('Connected Flight:', connectedFlight);
        
                if (connectedFlight) {
                  console.log('First and Connected Flight:', firstFlight, connectedFlight);
                  return {
                    FirstFlight: firstFlight,
                    SecondFlight: connectedFlight,
                  };
                }
                return null;
              } catch (error) {
                console.error('Error occurred in GetDirectFlightSchedule:', error);
                return null;
              }
            })
          );
        
          console.log('First Connected Flights:', firstconnectedFlights);
        
          const filteredFirstConnectedFlights = firstconnectedFlights.filter(
            (flight) => flight !== null
          );
        
          console.log('Filtered First Connected Flights:', filteredFirstConnectedFlights);
          setFinalFirstConnectingFlights(filteredFirstConnectedFlights);
        }

        if (secondconnectingFlights && secondconnectingFlights.length > 0) {
          const secondconnectedFlights = await Promise.all(
            secondconnectingFlights.map(async (firstFlight) => {
              const connectedFlight = await GetDirectFlightSchedule(
                firstFlight.DestinationAirportId,
                filters.source,  // Change filters.destination to the actual final destination
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
        
          const filteredSecondConnectedFlights = secondconnectedFlights.filter(
            (flight) => flight !== null
          );
        
          console.log(filteredSecondConnectedFlights);
          setFinalSecondConnectingFlights(filteredSecondConnectedFlights);
        }
      }
    } else {
      toast.error("Select Oneway or RoundTrip");
    }
  };

  const handleCheckboxChange = (type) => {
    setBookingType(type);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if ((name === "date" && value) || (name === "returndate" && value)) {
      const selectedDate = new Date(value);
      const formattedDateTime = selectedDate.toISOString();
      setDate(formattedDateTime.split(".")[0]);
      setFilters({ ...filters, [name]: value });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };
  /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// ///////////////////////////////////////////////
  const applyFilters = () => {
    const { date, source, destination, returndate } = filters;
    const filtered = flightSchedules.filter((schedule) => {
      const dateMatch =
        !date || schedule.DateTime.includes(date) || date === "";

      const returdateMatch =
        !returndate ||
        schedule.DateTime.includes(returndate) ||
        returndate === "";

      const sourceMatch = schedule.SourceAirportId === source || source === "";

      const destinationMatch =
        schedule.DestinationAirportId === destination || destination === "";

      return dateMatch && sourceMatch && destinationMatch && returdateMatch;
    });
    setFilteredSchedules(filtered);
  };

  const resetFilters = () => {
    setFilters({
      source: "",
      destination: "",
      date: "",
      returndate: "",
    });
    setFilteredSchedules(flightSchedules);
  };

  const handleFlightClick = (flight, mode) => {
    const flightDetails = JSON.stringify(flight);
    sessionStorage.setItem("directflight", flightDetails);
    navigate(`/FlightBookingDetail/${mode}`);
  };

  const handleConnectingFlightClick = (firstflight, secondflight, mode) => {
    const connectingFlights = {
      firstflight,
      secondflight,
    };
    console.log(connectingFlights);
    const connectingFlightDetails = JSON.stringify(connectingFlights);
    console.log(connectingFlightDetails);
    sessionStorage.setItem("connectingFlights", connectingFlightDetails);
    navigate(`/FlightBookingDetail/${mode}`);
  };

  const [roundTripFirstFlightDetails, setRoundTripFirstFlightDetails] =
    useState();
  const [roundTripSecondFlightDetails, setRoundTripSecondFlightDetails] =
    useState();

  const handleFirstFlightDirect = (flight) => {
    setRoundTripFirstFlightDetails(flight);
  };
  const handleFirstFlightConnect = (firstflight, secondflight) => {
    const connectingFlights = {
      firstflight,
      secondflight,
    };
    setRoundTripFirstFlightDetails(connectingFlights);
  };

  const handleSecondFlightDirect = (flight) => {
    setRoundTripSecondFlightDetails(flight);
  };

  const handleSecondFlightConnect = (firstflight, secondflight) => {
    const connectingFlights = {
      firstflight,
      secondflight,
    };
    setRoundTripSecondFlightDetails(connectingFlights);
  };

  const confirmRoundTripBooking = () => {
    const data = [roundTripFirstFlightDetails, roundTripSecondFlightDetails];

    const roundtripdetails = JSON.stringify(data);
    sessionStorage.setItem("RoundTripDetails", roundtripdetails);
    navigate(`/RoundTripBookingDetail`);
  };

  /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// ///////////////////////////////////////////////
  return (
    <div className="flex flex-col p-5 w-full justify-center items-center">
      <div className="flex flex-col gap-4 p-5 w-3/4 items-center justify-center">
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
          {bookingType == "roundtrip" && (
            <TextField
              label="Return Date"
              type="date"
              name="returndate"
              value={filters.returndate}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
            />
          )}

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
      {bookingType == "oneway" && searched && (
        <div>
          <DirectFlightDisplay
            data={directFlights}
            onClick={(flight, tripType) => {
              handleFlightClick(flight, tripType);
            }}
            mode="oneway"
          />
          <ConnectionFlightDisplay
            data={finalConnectingFlights}
            onClick={(flight, firstFlight, tripType) =>
              handleConnectingFlightClick(flight, firstFlight, tripType)
            }
            mode="oneway"
            />
            <ConnectionFlightDisplay
            data={finalIntegratedConnectingFlights}
            onClick={(flight, firstFlight, tripType) =>
              handleConnectingFlightClick(flight, firstFlight, tripType)
            }
            mode="oneway"
          />
        </div>
      )}
      {bookingType == "roundtrip" && searched &&  (
        <div className="flex flex-row justify-evenly">
          <div>
            <DirectFlightDisplay
              data={directFlightsFirstFlight}
              onClick={(flight) => {
                handleFirstFlightDirect(flight);
              }}
              mode="roundtrip"
            />

            
            <ConnectionFlightDisplay
              data={finalFirstConnectingFlights}
              onClick={(firstFlight, secondflight) =>
                handleFirstFlightConnect(firstFlight, secondflight)
              }
              mode="roundtrip"
            />
          </div>


          <div>
            <DirectFlightDisplay
              data={directFlightSecondFlight}
              onClick={(flight) => {
                handleSecondFlightDirect(flight);
              mode="roundtrip"

              }}
            />
<ConnectionFlightDisplay
              data={finalSecondConnectingFlights}
              onClick={(firstFlight, secondflight) =>
                handleSecondFlightConnect(firstFlight, secondflight)
              }
              mode="roundtrip"
            />


            <button onClick={() => confirmRoundTripBooking()}>
              confirm booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHome;
