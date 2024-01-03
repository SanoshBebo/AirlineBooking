import React, { useEffect, useRef, useState } from "react";
import GetPassengerInfo from "../../components/GetPassengerInfo";
import SeatDisplay from "../../components/SeatDisplay";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { ChangeSeatStatus, GetSeatsForSchedule } from "../../api/Seat";
import { SanoshAirlineDetails } from "../../components/Constants";
import SessionExpired from "../../components/SessionExpired";

const RoundTripBooking = () => {
  const [flightno, setflightno] = useState(0);
  const [mode, setMode] = useState("");
  const [connectingFlightDetails, setConnectingFlightDetails] = useState([]);
  const [directFlightDetail, setDirectFlightDetail] = useState([]);

  const [firstFlightScheduleId, setfirstFlightScheduleId] = useState();
  const [firstConnectedFlightScheduleId, setFirstConnectedFlightScheduleId] =
    useState();
  const [secondConnectedFlightScheduleId, setSecondConnectedFlightScheduleId] =
    useState();

  const [userDetails, setUserDetails] = useState([]);

  const [getUserDetails, setGetUserDetails] = useState(false);

  const [singleFlightScheduleSeats, setSingleFlightScheduleSeats] = useState(
    []
  );

  const [selectedSeatsForPassengers, setSelectedSeatsForPassengers] = useState(
    []
  );
  const [
    connectingFlightPassengerScheduleDetails,
    setConnectingFlightPassengerScheduleDetails,
  ] = useState([]);

  const navigate = useNavigate();

  const [
    connectingFlightFirstScheduleSeats,
    setConnectingFlightFirstScheduleSeats,
  ] = useState([]);
  const [
    connectingFlightSecondScheduleSeats,
    setConnectingFlightSecondScheduleSeats,
  ] = useState([]);

  const [singleFlightSelectedSeats, setSingleFlightSelectedSeats] = useState(
    []
  );
  const [
    connectingFlightFirstSelectedSeats,
    setConnectingFlightFirstSelectedSeats,
  ] = useState([]);
  const [
    connectingFlightSecondSelectedSeats,
    setConnectingFlightSecondSelectedSeats,
  ] = useState([]);

  const [singleFlightSeatRows, setSingleFlightSeatRows] = useState([]);
  const [connectingFlightFirstSeatRows, setConnectingFlightFirstSeatRows] =
    useState([]);
  const [connectingFlightSecondSeatRows, setConnectingFlightSecondSeatRows] =
    useState([]);

  const [singleFlightUpdateFlag, setSingleFlightUpdateFlag] = useState(false);

  const [connectingFlightFirstUpdateFlag, setConnectingFlightFirstUpdateFlag] =
    useState(false);

  const [
    connectingFlightSecondUpdateFlag,
    setConnectingFlightSecondUpdateFlag,
  ] = useState(false);

  const [passengerSeatSelections, setPassengerSeatSelections] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [isFirstConnectedFlight, setIsFirstConnectedFlight] = useState(true);
  const [isSecondConnectedFlight, setIsSecondConnectedFlight] = useState(false);
  const [roundTripDetails, setRoundTripDetails] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const seatsRef = useRef(null);

  useEffect(() => {
    if (sessionStorage.length == 0) {
      navigate("/unauthorized");
    } else {
      getFlightDetails();
    }
  }, [getUserDetails, refresh]);

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

  const getFlightDetails = () => {
    const roundTripDetails = JSON.parse(
      sessionStorage.getItem("RoundTripDetails")
    );

    if (roundTripDetails[flightno].firstflight) {
      setMode("connectingTrip");
      setFirstConnectedFlightScheduleId(
        roundTripDetails[flightno].firstflight.ScheduleId
      );
      setSecondConnectedFlightScheduleId(
        roundTripDetails[flightno].secondflight.ScheduleId
      );
      setConnectingFlightDetails(roundTripDetails[flightno]);

      GetSeatsForSchedule(
        roundTripDetails[flightno].firstflight.apiPath,
        roundTripDetails[flightno].firstflight.ScheduleId
      )
        .then((res) => {
          const firstres = res.map((seat) => capitalizeKeys(seat));
          setConnectingFlightFirstScheduleSeats(firstres);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            setSessionExpired(true);
            console.error("Unauthorized access. Please log in again.");
          } else {
            console.error("Error fetching seats for single flight:", error);
            // Handle other errors if needed
          }
        });

      GetSeatsForSchedule(
        roundTripDetails[flightno].secondflight.apiPath,
        roundTripDetails[flightno].secondflight.ScheduleId
      )
        .then((res) => {
          const firstres = res.map((seat) => capitalizeKeys(seat));
          setConnectingFlightSecondScheduleSeats(firstres);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            setSessionExpired(true);
            console.error("Unauthorized access. Please log in again.");
          } else {
            console.error("Error fetching seats for single flight:", error);
            // Handle other errors if needed
          }
        });
    } else {
      setMode("singleTrip");
      setfirstFlightScheduleId(roundTripDetails[flightno].ScheduleId);
      setDirectFlightDetail(roundTripDetails[flightno]);
      let apipath = "";
      if (roundTripDetails[flightno]?.apiPath) {
        apipath = roundTripDetails[flightno]?.apiPath;
      } else {
        apipath = SanoshAirlineDetails.SanoshAirlines.apiPath;
      }

      console.log(apipath);

      GetSeatsForSchedule(apipath, roundTripDetails[flightno].ScheduleId)
        .then((res) => {
          const firstres = res.map((seat) => capitalizeKeys(seat));
          setSingleFlightScheduleSeats(firstres);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            setSessionExpired(true);
            console.error("Unauthorized access. Please log in again.");
          } else {
            console.error("Error fetching seats for single flight:", error);
            // Handle other errors if needed
          }
        });
    }
  };

  useEffect(() => {
    arrangeSeats(
      singleFlightScheduleSeats,
      setSingleFlightSeatRows,
      singleFlightSelectedSeats,
      setSingleFlightUpdateFlag
    );
  }, [singleFlightScheduleSeats, singleFlightSelectedSeats]);

  useEffect(() => {
    arrangeSeats(
      connectingFlightFirstScheduleSeats,
      setConnectingFlightFirstSeatRows,
      connectingFlightFirstSelectedSeats,
      setConnectingFlightFirstUpdateFlag
    );
  }, [connectingFlightFirstScheduleSeats, connectingFlightFirstSelectedSeats]);

  useEffect(() => {
    arrangeSeats(
      connectingFlightSecondScheduleSeats,
      setConnectingFlightSecondSeatRows,
      connectingFlightSecondSelectedSeats,
      setConnectingFlightSecondUpdateFlag
    );
  }, [
    connectingFlightSecondScheduleSeats,
    connectingFlightSecondSelectedSeats,
  ]);

  const bookFlight = (scheduleid, status, seatList) => {
    if (passengerSeatSelections.length == 0) {
      toast.error("Please selects your seats");
      return;
    }

    const passengersWithSeats = userDetails.filter((passenger, index) => {
      return passengerSeatSelections[index];
    });

    console.log(passengersWithSeats);

    if (passengersWithSeats.length !== userDetails.length) {
      toast.error("Please select seats for all passengers.");
      return; // Exit the function if any passenger has not selected a seat
    }

    if (mode == "singleTrip") {
      const updatedPassengerDetails = userDetails.map((passenger, index) => ({
        ...passenger,
        SeatNo: passengerSeatSelections[index] || "",
      }));
      if (flightno == 1) {
        sessionStorage.setItem(
          "FlightTwo",
          JSON.stringify(updatedPassengerDetails)
        );

        ChangeSeatStatus(
          SanoshAirlineDetails.SanoshAirlines.apiPath,
          scheduleid,
          status,
          seatList
        )
          .then((res) => {
            if (mode == "singleTrip") {
              setSingleFlightSelectedSeats([]);
              setRefresh(!refresh);
              navigate("/FlightBooking/ConfirmBooking");
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              setSessionExpired(true);
              console.error("Unauthorized access. Please log in again.");
            } else {
              console.error("Error fetching seats for single flight:", error);
              // Handle other errors if needed
            }
          });
      } else {
        sessionStorage.setItem(
          "FlightOne",
          JSON.stringify(updatedPassengerDetails)
        );
        setflightno(1);
        ChangeSeatStatus(
          SanoshAirlineDetails.SanoshAirlines.apiPath,
          scheduleid,
          status,
          seatList
        )
          .then((res) => {
            if (mode == "singleTrip") {
              setSingleFlightSelectedSeats([]);
              setRefresh(!refresh);
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              setSessionExpired(true);
              console.error("Unauthorized access. Please log in again.");
            } else {
              console.error("Error fetching seats for single flight:", error);
              // Handle other errors if needed
            }
          });
      }
    } else if (mode == "connectingTrip" && isFirstConnectedFlight) {
      const updatedPassengerDetails = userDetails.map((passenger, index) => ({
        ...passenger,
        SeatNo: passengerSeatSelections[index] || "",
      }));
      setConnectingFlightPassengerScheduleDetails(updatedPassengerDetails);
      ChangeSeatStatus(
        SanoshAirlineDetails.SanoshAirlines.apiPath,
        scheduleid,
        status,
        seatList
      )
        .then((res) => {
          if (mode == "connectingTrip" && isFirstConnectedFlight) {
            setIsSecondConnectedFlight(!isSecondConnectedFlight);
            setIsFirstConnectedFlight(!isFirstConnectedFlight);
            setRefresh(!refresh);
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            setSessionExpired(true);
            console.error("Unauthorized access. Please log in again.");
          } else {
            console.error("Error fetching seats for single flight:", error);
            // Handle other errors if needed
          }
        });
    } else if (mode == "connectingTrip" && isSecondConnectedFlight) {
      const updatedPassengerDetails = userDetails.map((passenger, index) => ({
        ...passenger,
        SeatNo: passengerSeatSelections[index] || "",
      }));
      const combinedPassengerDetails = [
        ...connectingFlightPassengerScheduleDetails,
        ...updatedPassengerDetails,
      ];
      setConnectingFlightPassengerScheduleDetails(combinedPassengerDetails);
      setRefresh(!refresh);
      console.log(connectingFlightPassengerScheduleDetails);
      if (flightno == 1) {
        console.log(combinedPassengerDetails);
        sessionStorage.setItem(
          "FlightTwo",
          JSON.stringify(combinedPassengerDetails)
        );
        ChangeSeatStatus(
          SanoshAirlineDetails.SanoshAirlines.apiPath,
          scheduleid,
          status,
          seatList
        )
          .then((res) => {
            if (mode == "connectingTrip" && isSecondConnectedFlight) {
              setConnectingFlightFirstSelectedSeats([]);
              setConnectingFlightSecondSelectedSeats([]);
              setIsSecondConnectedFlight(!isSecondConnectedFlight);
              setIsFirstConnectedFlight(!isFirstConnectedFlight);
              setRefresh(!refresh);
              navigate("/FlightBooking/ConfirmBooking");
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              setSessionExpired(true);
              console.error("Unauthorized access. Please log in again.");
            } else {
              console.error("Error fetching seats for single flight:", error);
              // Handle other errors if needed
            }
          });
      } else if (flightno == 0) {
        setflightno(1);
        console.log(combinedPassengerDetails);
        sessionStorage.setItem(
          "FlightOne",
          JSON.stringify(combinedPassengerDetails)
        );

        ChangeSeatStatus(
          SanoshAirlineDetails.SanoshAirlines.apiPath,
          scheduleid,
          status,
          seatList
        )
          .then((res) => {
            if (mode == "connectingTrip" && isSecondConnectedFlight) {
              setConnectingFlightFirstSelectedSeats([]);
              setConnectingFlightSecondSelectedSeats([]);
              setIsSecondConnectedFlight(!isSecondConnectedFlight);
              setIsFirstConnectedFlight(!isFirstConnectedFlight);
              setRefresh(!refresh);
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              setSessionExpired(true);
              console.error("Unauthorized access. Please log in again.");
            } else {
              console.error("Error fetching seats for single flight:", error);
              // Handle other errors if needed
            }
          });
      }
    }
    
    setTimeout(() => {
            
      if (seatsRef.current) {
        seatsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 500);
  };

  const arrangeSeats = (seats, setSeatRows, selectedSeats) => {
    const seatMap = {};
    const rows = [];
    const seatOrder = ["A", "B", "C", " ", "D", "E", "F"]; // Adding a space for visual gap
  
    seats.forEach((seat) => {
      const row = seat.SeatNumber.charAt(0);
      const col = parseInt(seat.SeatNumber.substring(1));
      if (!seatMap[row]) {
        seatMap[row] = [];
      }
      seatMap[row][col] = seat;
    });
  
    for (let i = 1; i <= 17; i++) {
      const formattedRow = seatOrder.map((row, index) => {
        const seat = seatMap[row] ? seatMap[row][i] : null;
        const isSpace = row === " "; // Identifying the space element in the array
  
        return (
          <div
            key={seat ? seat.SeatNumber : `${row}-${i}`}
            className={`seat p-3 m-2 border rounded-md w-12 h-12 flex items-center justify-center 
              ${
                seat && selectedSeats.includes(seat.SeatNumber)
                  ? "bg-green-300 cursor-pointer"
                  : seat && seat.Status === "Available"
                  ? "bg-slate-100 cursor-pointer hover:bg-gray-100"
                  : seat
                  ? "bg-[#990011] text-white cursor-not-allowed opacity-20"
                  : "hidden"
              }
              ${isSpace ? "hidden" : ""}`} // Hide the space element
            onClick={() => seat && selectSeat(seat, mode)}
          >
            {seat && (seat.Status === "Available" || seat.Status === "Booked")
              ? seat.SeatNumber
              : ""}
          </div>
        );
      });
  
      rows.push(
        <div key={i} className="flex seat-row">
          {formattedRow} {/* Display all seats in a row */}
        </div>
      );
    }
  
    setSeatRows(rows);
  };
  

  const selectSeat = (seat, mode) => {
    if (mode === "singleTrip") {
      setSingleFlightSelectedSeats((prevSelectedSeats) => {
        if (prevSelectedSeats.includes(seat.SeatNumber)) {
          return prevSelectedSeats.filter(
            (selectedSeat) => selectedSeat !== seat.SeatNumber
          );
        } else if (
          singleFlightSelectedSeats.length < userDetails.length &&
          seat.Status === "Available"
        ) {
          return [...prevSelectedSeats, seat.SeatNumber];
        } else {
          return prevSelectedSeats;
        }
      });
    } else if (mode === "connectingTrip") {
      if (isFirstConnectedFlight) {
        setConnectingFlightFirstSelectedSeats((prevSelectedSeats) => {
          if (prevSelectedSeats.includes(seat.SeatNumber)) {
            return prevSelectedSeats.filter(
              (selectedSeat) => selectedSeat !== seat.SeatNumber
            );
          } else if (
            connectingFlightFirstSelectedSeats.length < userDetails.length &&
            seat.Status === "Available"
          ) {
            return [...prevSelectedSeats, seat.SeatNumber];
          } else {
            return prevSelectedSeats;
          }
        });
      } else if (isSecondConnectedFlight) {
        setConnectingFlightSecondSelectedSeats((prevSelectedSeats) => {
          if (prevSelectedSeats.includes(seat.SeatNumber)) {
            return prevSelectedSeats.filter(
              (selectedSeat) => selectedSeat !== seat.SeatNumber
            );
          } else if (
            connectingFlightSecondSelectedSeats.length < userDetails.length &&
            seat.Status === "Available"
          ) {
            return [...prevSelectedSeats, seat.SeatNumber];
          } else {
            return prevSelectedSeats;
          }
        });
      }
    }

    if (mode === "singleTrip" || mode === "connectingTrip") {
      if (userDetails.length > 0) {
        let newSelectedSeatsForPassengers = [];

        userDetails.forEach((passenger, index) => {
          if (selectedSeatsForPassengers[index] === undefined) {
            newSelectedSeatsForPassengers.push({
              ...passenger,
              seatno: "",
            });
          } else {
            newSelectedSeatsForPassengers.push(
              selectedSeatsForPassengers[index]
            );
          }
        });

        newSelectedSeatsForPassengers = newSelectedSeatsForPassengers.map(
          (passenger, index) => {
            if (index === userDetails.length - 1 && passenger.seatno === "") {
              return { ...passenger, seatno: seat.SeatNumber };
            }
            return passenger;
          }
        );

        setSelectedSeatsForPassengers(newSelectedSeatsForPassengers);
      }
    }
  };

  const handlePassengerSeatSelection = (index, selectedSeat) => {
    const updatedSelections = [...passengerSeatSelections];
    updatedSelections[index] = selectedSeat;
    setPassengerSeatSelections(updatedSelections);
  };

  return (
    <>
      {!getUserDetails && (
        <GetPassengerInfo
          userDetails={(passengers) => {
            setGetUserDetails(!getUserDetails);
            console.log(passengers);
            setUserDetails(passengers);
            setSelectedSeatsForPassengers([]);
          }}
        />
      )}
      {sessionExpired ? (
        <SessionExpired
          message="Your Session Has Expired"
          redirectUrl="/login"
        />
      ) : (
        <div className="flex flex-col lg:flex-col p-5 lg:p-10 items-center justify-center" ref={seatsRef}>
          <div className="lg:w-full">
            {getUserDetails && (
              <div className="flex justify-center items-center">
                {mode === "singleTrip" && (
                  <div className=" flex flex-col justify-center items-center text-center">
                  <div className="flex flex-col py-10 ">
                    <h1 className="text-3xl font-bold mb-4 text-blue-700">
                      {directFlightDetail.FlightName}
                    </h1>
                    <div className="flex flex-row items-center space-x-4">
                      <h1 className="text-lg font-semibold text-gray-800">
                        {
                          directFlightDetail.SourceAirportName
                        }
                      </h1>
                      <span className="text-lg font-semibold text-gray-500 mx-2">
                        -
                      </span>
                      <h1 className="text-lg font-semibold text-gray-800">
                        {
                          directFlightDetail.DestinationAirportName
                        }
                      </h1>
                    </div>
                  </div>

                    

                    <SeatDisplay
                      seatlist={singleFlightSeatRows}
                      book={() =>
                        bookFlight(
                          firstFlightScheduleId,
                          "Booked",
                          singleFlightSelectedSeats
                        )
                      }
                    />
                  </div>
                )}
                {mode === "connectingTrip" && isFirstConnectedFlight && (
                  <div className=" flex flex-col justify-center items-center text-center">
                    <div className="flex flex-col py-10 ">
                      <h1 className="text-3xl font-bold mb-4 text-blue-700">
                        {connectingFlightDetails.firstflight.FlightName}
                      </h1>
                      <div className="flex flex-row items-center space-x-4">
                        <h1 className="text-lg font-semibold text-gray-800">
                          {
                            connectingFlightDetails.firstflight
                              .SourceAirportName
                          }
                        </h1>
                        <span className="text-lg font-semibold text-gray-500 mx-2">
                          -
                        </span>
                        <h1 className="text-lg font-semibold text-gray-800">
                          {
                            connectingFlightDetails.firstflight
                              .DestinationAirportName
                          }
                        </h1>
                      </div>
                    </div>

                    <SeatDisplay
                      seatlist={connectingFlightFirstSeatRows}
                      book={() =>
                        bookFlight(
                          firstConnectedFlightScheduleId,
                          "Booked",
                          connectingFlightFirstSelectedSeats
                        )
                      }
                    />
                  </div>
                )}
                {mode === "connectingTrip" && isSecondConnectedFlight && (
                  <div className=" flex flex-col items-center justify-center text-center">
                    <div className="flex flex-col py-10">
                      <h1 className="text-3xl font-bold mb-4 text-blue-700">
                        {connectingFlightDetails.secondflight.FlightName}
                      </h1>
                      <div className="flex flex-row items-center space-x-4">
                        <h1 className="text-lg font-semibold text-gray-800">
                          {
                            connectingFlightDetails.secondflight
                              .SourceAirportName
                          }
                        </h1>
                        <span className="text-lg font-semibold text-gray-500 mx-2">
                          -
                        </span>
                        <h1 className="text-lg font-semibold text-gray-800">
                          {
                            connectingFlightDetails.secondflight
                              .DestinationAirportName
                          }
                        </h1>
                      </div>
                    </div>
                    <SeatDisplay
                      seatlist={connectingFlightSecondSeatRows}
                      book={() =>
                        bookFlight(
                          secondConnectedFlightScheduleId,
                          "Booked",
                          connectingFlightSecondSelectedSeats
                        )
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="lg:w-1/2 lg:mx-auto">
            {" "}
            {/* Set width to 50% and center the content */}
            {getUserDetails &&
              userDetails.map((passenger, index) => (
                <div key={index} className="mb-4 p-5">
                  <p className="font-semibold">{passenger.Name}'s Seat:</p>
                  <select
                    value={passengerSeatSelections[index] || ""}
                    onChange={(e) =>
                      handlePassengerSeatSelection(index, e.target.value)
                    }
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Seat</option>
                    {mode === "singleTrip" &&
                      singleFlightSelectedSeats.map((seat, seatIndex) => (
                        <option key={seatIndex} value={seat}>
                          {seat}
                        </option>
                      ))}
                    {mode === "connectingTrip" &&
                      isFirstConnectedFlight &&
                      connectingFlightFirstSelectedSeats.map(
                        (seat, seatIndex) => (
                          <option key={seatIndex} value={seat}>
                            {seat}
                          </option>
                        )
                      )}
                    {mode === "connectingTrip" &&
                      isSecondConnectedFlight &&
                      connectingFlightSecondSelectedSeats.map(
                        (seat, seatIndex) => (
                          <option key={seatIndex} value={seat}>
                            {seat}
                          </option>
                        )
                      )}
                  </select>
                </div>
              ))}
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default RoundTripBooking;
