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
  Box,
  Button,
  CircularProgress,
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
import MediaLoader from "../../components/MediaLoader";

import Message from "../../components/assetDisplayComponent/Message";
import bg from "../../assets/MainpageBG.jpg";
import { Authenticate } from "../../helper_functions/Authenticator";

const UserHome = () => {
  const [flightSchedules, setFlightSchedules] = useState([]);

  const [flights, setFlights] = useState([]);
  const [directFlights, setDirectFlights] = useState([]);
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

  const [bookingType, setBookingType] = useState("oneway");
  const [searched, setSearched] = useState(false);

  const [roundTripFlightsFound, setRoundTripFlightsFound] = useState(false);

  const [directFlightsFirstFlight, setDirectFlightsFirstFlight] = useState([]);

  const [connectingFlightsFirstFlight, setConnectingFlightsFirstFlight] =
    useState([]);

  const [directFlightSecondFlight, setDirectFlightSecondFlight] = useState([]);

  const [loaded, setLoaded] = useState(false);

  const firstAirlines = [];
  const secondAirlines = [];
  const [
    selectedDirectFlightsFirstFlight,
    setSelectedDirectFlightsFirstFlight,
  ] = useState();
  const [
    selectedFinalFirstConnectingFlights,
    setSelectedFinalFirstConnectingFlights,
  ] = useState();
  const [
    selectedDirectFlightSecondFlight,
    setSelectedDirectFlightSecondFlight,
  ] = useState();
  const [
    selectedFinalSecondConnectingFlights,
    setSelectedFinalSecondConnectingFlights,
  ] = useState();

  /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// ///////////////////////////////////////////////
  useEffect(() => {
    GetAirports().then((res) => {
      setAirports(res);
    });

    GetFlightDetails().then((res) => {
      setFlights(res);
    });
  }, [refresh]);

  function capitalizeKeys(obj) {
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        newObj[capitalizedKey] = obj[key];
      }
    }
    return newObj;
  }

  const getIntegratedFlightDetails = async (
    firstAirlines,
    secondAirlines,
    source,
    destination,
    dateTime
  ) => {
    const connectionSchedules = [];
    console.log(firstAirlines, secondAirlines, source, destination, dateTime);

    await Promise.all(
      Object.entries(firstAirlines).map(
        async ([firstAirlineName, firstAirline]) => {
          try {
            console.log(firstAirline.apiPath, dateTime);
            const firstResponse = await axios.get(
              `${firstAirline.apiPath}Integration/connectingflight/${source}/${destination}/${dateTime}`
            );
            console.log(firstResponse);
            const firstres = firstResponse.data.map((flight) =>
              capitalizeKeys(flight)
            );
            const firstFlights = firstres.map((firstFlight) => ({
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
                          const secondResponseData = secondResponse.data.map(
                            (flight) => capitalizeKeys(flight)
                          );
                          console.log(secondResponseData);
                          const secondFlights = secondResponseData.map(
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
    console.log(connectionSchedules);
    return connectionSchedules;
  };

  const clearStates = () =>{
    setConnectingFlightsFirstFlight([]);
    setConnectingFlightsFirstFlight([]);
    setDirectFlightsFirstFlight([]);
    setDirectFlightSecondFlight([]);
    setDirectFlights([]);
    setFinalIntegratedConnectingFlights([]);
    setDirectFlightsFirstFlight([]);
    setFinalFirstConnectingFlights([]);
    setDirectFlightSecondFlight([]);
    setFinalSecondConnectingFlights([]);
    setSearched(true);
    setLoaded(false);
    setRoundTripFlightsFound(false)
  }

  const searchFlightSchedules = async () => {
    clearStates();
    if (bookingType == "oneway" || bookingType == "roundtrip") {
      if (bookingType == "oneway") {
        GetDirectFlightSchedule(
          filters.source,
          filters.destination,
          filters.date
        )
          .then((res) => {
            setDirectFlights(res);
            console.log(res);
          })
          .catch((err) => {
            console.error(err);
          });

        const firstResult = await getIntegratedFlightDetails(
          SanoshAirlineDetails,
          airlinesapi,
          filters.source,
          filters.destination,
          filters.date
        );
        const secondResult = await getIntegratedFlightDetails(
          airlinesapi,
          SanoshAirlineDetails,
          filters.source,
          filters.destination,
          filters.date
        );

        const data = [...firstResult, ...secondResult];
        console.log(data);
        setFinalIntegratedConnectingFlights(data);

        setLoaded(true);
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

        setLoaded(true);

        const firstmineconnectingFlights = await getIntegratedFlightDetails(
          SanoshAirlineDetails,
          airlinesapi,
          filters.source,
          filters.destination,
          filters.date
        );
        const firstnotmineconnectingFlights = await getIntegratedFlightDetails(
          airlinesapi,
          SanoshAirlineDetails,
          filters.source,
          filters.destination,
          filters.date
        );

        console.log(firstmineconnectingFlights, firstnotmineconnectingFlights);

        const firstData = [
          ...firstmineconnectingFlights,
          ...firstnotmineconnectingFlights,
        ];

        setFinalFirstConnectingFlights(firstData);

        const secondmineconnectingFlights = await getIntegratedFlightDetails(
          SanoshAirlineDetails,
          airlinesapi,
          filters.destination,
          filters.source,
          filters.returndate
        );

        const secondnotmineconnectingFlights = await getIntegratedFlightDetails(
          airlinesapi,
          SanoshAirlineDetails,
          filters.destination,
          filters.source,
          filters.returndate
        );

        console.log(
          secondmineconnectingFlights,
          secondnotmineconnectingFlights
        );

        const secondData = [
          ...secondmineconnectingFlights,
          ...secondnotmineconnectingFlights,
        ];

        setFinalSecondConnectingFlights(secondData);
      }
    } else {
      toast.error("Select Oneway or RoundTrip");
    }
  };

  const handleCheckboxChange = (type) => {
    setSearched(false);
    setBookingType(type);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if ((name === "date" && value) || (name === "returndate" && value)) {
      const selectedDate = new Date(value);
      const formattedDateTime = selectedDate.toISOString();
      const currentDate = new Date(filters.date); // Assuming 'date' is your onward date state

      if (name == "returndate" && selectedDate <= currentDate) {
        toast.error("Return date should be greater than onward date");
      } else {
        setDate(formattedDateTime.split(".")[0]);
        setFilters({ ...filters, [name]: value });
      }
    } else {
      setFilters({ ...filters, [name]: value });
    }
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
    if (Authenticate("user")) {
      sessionStorage.setItem("directflight", flightDetails);
      navigate(`/FlightBookingDetail/${mode}`);
    } else {
      sessionStorage.setItem("directflight", flightDetails);
      sessionStorage.setItem("redirectUrl", `/FlightBookingDetail/${mode}`);
      navigate("/login");
    }
  };

  const handleConnectingFlightClick = (secondflight, firstflight, mode) => {
    const connectingFlights = {
      firstflight,
      secondflight,
    };
    console.log(connectingFlights);
    const connectingFlightDetails = JSON.stringify(connectingFlights);

    if (Authenticate("user")) {
      sessionStorage.setItem("connectingFlights", connectingFlightDetails);
      navigate(`/FlightBookingDetail/${mode}`);
    } else {
      sessionStorage.setItem("connectingFlights", connectingFlightDetails);
      sessionStorage.setItem("redirectUrl", `/FlightBookingDetail/${mode}`);
      navigate("/login");
    }
  };

  const [roundTripFirstFlightDetails, setRoundTripFirstFlightDetails] =
    useState();
  const [roundTripSecondFlightDetails, setRoundTripSecondFlightDetails] =
    useState();
  const [roundTripFirstFlightType, setRoundTripFirstFlightType] = useState("");
  const [roundTripSecondFlightType, setRoundTripSecondFlightType] =
    useState("");

  const handleFirstFlightDirect = (flight) => {
    setRoundTripFirstFlightDetails(flight);
    setSelectedDirectFlightsFirstFlight([flight]);

    console.log([flight]);
    setRoundTripFirstFlightType("direct");
  };

  const handleFirstFlightConnect = (firstflight, secondflight) => {
    const connectingFlights = {
      firstflight,
      secondflight,
    };
    console.log(connectingFlights);
    setRoundTripFirstFlightDetails(connectingFlights);
    const selectedInfo = [
      {
        FirstFlight: firstflight,
        SecondFlight: [secondflight],
      },
    ];
    console.log(selectedInfo);
    setSelectedFinalFirstConnectingFlights(selectedInfo);
    setRoundTripFirstFlightType("connecting");
  };

  const handleSecondFlightDirect = (flight) => {
    setRoundTripSecondFlightDetails(flight);
    setSelectedDirectFlightSecondFlight([flight]);
    console.log([flight]);
    setRoundTripSecondFlightType("direct");
  };

  const handleSecondFlightConnect = (firstflight, secondflight) => {
    const connectingFlights = {
      firstflight,
      secondflight,
    };
    setRoundTripSecondFlightDetails(connectingFlights);
    const selectedInfo = [
      {
        FirstFlight: firstflight,
        SecondFlight: [secondflight],
      },
    ];
    console.log(selectedInfo);
    setSelectedFinalSecondConnectingFlights(selectedInfo);
    setRoundTripSecondFlightType("connecting");
  };

  const confirmRoundTripBooking = () => {
    if (roundTripFirstFlightDetails && roundTripSecondFlightDetails) {
      const data = [roundTripFirstFlightDetails, roundTripSecondFlightDetails];

      const roundtripdetails = JSON.stringify(data);
      sessionStorage.setItem("RoundTripDetails", roundtripdetails);
      navigate(`/RoundTripBookingDetail`);
    } else {
      toast.error("Select Onward And Return Flight to Proceed");
    }
  };

  /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// /////////////////////////////////////////////// ///////////////////////////////////////////////
  return (
    <div className={`flex flex-col w-full min-h-[90vh] text-white`}>
      <div className="flex flex-col gap-4 p-5 w-full items-center justify-center h-[95vh] bg-white bg-gradient-to-r from-white to-orange-300">
        <div className="flex flex-row gap-10 p-3 items-center justify-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-500 bg-white rounded-sm border-gray-300 focus:ring-2 focus:ring-blue-500"
              {...(bookingType == "oneway"
                ? { checked: true }
                : { checked: false })}
              onChange={() => handleCheckboxChange("oneway")}
            />
            <label htmlFor="oneway" className="ml-2 text-gray-700 font-medium">
              One Way
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-500 bg-white rounded-sm border-gray-300 focus:ring-2 focus:ring-blue-500"
              checked={bookingType === "roundtrip"}
              onChange={() => handleCheckboxChange("roundtrip")}
            />
            <label
              htmlFor="roundtrip"
              className="ml-2 text-gray-700 font-medium"
            >
              Roundtrip
            </label>
          </div>
        </div>
        <div className="flex text-white flex-row gap-2 p-3">
          <FormControl sx={{ minWidth: 200, maxWidth: 200 }}>
            <InputLabel id="demo-simple-select-label">From</InputLabel>
            <Select
              value={filters.source}
              onChange={handleFilterChange}
              name="source"
              label="From"
              className="bg-white"
            >
              <MenuItem value="" disabled>
                Choose a Source
              </MenuItem>
              {airports.map((airport) => (
                <MenuItem key={airport.AirportId} value={airport.AirportId}>
                  {airport.City},{airport.AirportName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200, maxWidth: 200 }}>
            <InputLabel id="demo-simple-select-label">To</InputLabel>
            <Select
              value={filters.destination}
              onChange={handleFilterChange}
              name="destination"
              label="To"
              className="bg-white"
            >
              <MenuItem value="" disabled>
                Choose a Destination
              </MenuItem>
              {airports.map((airport) => (
                <MenuItem key={airport.AirportId} value={airport.AirportId}>
                  {airport.City},{airport.AirportName}
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
            className="bg-white"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Return Date"
            type="date"
            name="returndate"
            className={`bg-white`}
            value={filters.returndate}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
            {...(bookingType === "oneway" ? { disabled: true } : {})}
          />
        </div>
        <div className="flex flex-row gap-5">
          <button
            className="text-white font-medium rounded p-2 bg-[#FFC107]"
            onClick={() => {
              // applyFilters();
              searchFlightSchedules();
            }}
          >
            Search Flights
          </button>
          <button
            className="bg-[#FFA000] text-white font-medium rounded p-2"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="flex  w-full bg-gradient-to-r from-white to-orange-300">
        {/* <div className="flex flex-col w-1/4  flex-wrap"></div> */}
        <div
          className={`${
            searched && bookingType != "" ? "visible" : "hidden"
          } p-10 text-[#607d8b] w-full`}
        >
          {!searched && (
            <Message
              data={
                "Prepared with the boarding pass in hand, all set to take flight!"
              }
            />
          )}

          {bookingType == "oneway" &&
            searched &&
            (loaded ? (
              directFlights.length > 0 ||
              finalIntegratedConnectingFlights.length > 0 ? (
                <div className="flex flex-col items-center w-full mx-auto">
                  <DirectFlightDisplay
                    data={directFlights}
                    onClick={(flight, tripType) => {
                      handleFlightClick(flight, tripType);
                    }}
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
              ) : (
                <Message data={"Oops, NO FLIGHTS AVAILABLE :("} />
              )
            ) : (
              <MediaLoader />
            ))}

          {bookingType == "roundtrip" && searched && (
            <div className="flex flex-col">
              <div className="flex flex-row gap-20 p-10">
                <div className="flex flex-col w-1/2 ">
                  <h1 className="font-semibold text-2xl text-center p-4 text-[#003366]">
                    ONWARD FLIGHT
                  </h1>

                  {roundTripFirstFlightType == "direct" && (
                    <DirectFlightDisplay
                      data={selectedDirectFlightsFirstFlight}
                      mode="roundtrip"
                    />
                  )}

                  {roundTripFirstFlightType == "connecting" && (
                    <ConnectionFlightDisplay
                      data={selectedFinalFirstConnectingFlights}
                      mode="roundtrip"
                    />
                  )}
                </div>

                <div className="flex flex-col w-1/2">
                  <h1 className="font-semibold text-2xl text-center p-4 text-[#003366]">
                    RETURN FLIGHT
                  </h1>
                  {roundTripSecondFlightType == "direct" && (
                    <DirectFlightDisplay
                      data={selectedDirectFlightSecondFlight}
                      mode="roundtrip"
                    />
                  )}

                  {roundTripSecondFlightType == "connecting" && (
                    <ConnectionFlightDisplay
                      data={selectedFinalSecondConnectingFlights}
                      mode="roundtrip"
                    />
                  )}
                </div>
              </div>
              <div className="w-full">
                <button
                  className="w-full rounded-lg p-4 mb-10 bg-red-500 text-white hover:bg-[#7c1420] transition duration-300 ease-in-out "
                  onClick={() => confirmRoundTripBooking()}
                >
                  confirm booking
                </button>
              </div>

              <div className="flex flex-row gap-20 p-10">
                <div className="flex flex-col w-1/2 ">
                  <h1 className="font-semibold text-2xl text-center p-4 text-[#003366]">
                    ONWARD FLIGHTS
                  </h1>
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

                <div className="flex flex-col w-1/2">
                  <h1 className="font-semibold text-2xl text-center p-4 text-[#003366]">
                    RETURN FLIGHTS
                  </h1>

                  <DirectFlightDisplay
                    data={directFlightSecondFlight}
                    onClick={(flight) => {
                      handleSecondFlightDirect(flight);
                    }}
                    mode="roundtrip"
                  />
                  <ConnectionFlightDisplay
                    data={finalSecondConnectingFlights}
                    onClick={(firstFlight, secondflight) =>
                      handleSecondFlightConnect(firstFlight, secondflight)
                    }
                    mode="roundtrip"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default UserHome;
