import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChangeSeatStatus, GetSeatsForSchedule } from "../../api/Seat";
import SeatDisplay from "../../components/SeatDisplay";
import GetPassengerInfo from "../../components/GetPassengerInfo";
import { ToastContainer, toast } from "react-toastify";
import { SanoshAirlineDetails } from "../../components/Constants";
import SessionExpired from "../../components/SessionExpired";

const FlightBooking = () => {
  const { mode } = useParams();

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
  const seatsRef = useRef(null);

  const [
    connectingFlightFirstScheduleSeats,
    setConnectingFlightFirstScheduleSeats,
  ] = useState([]);
  const [connectingFlightDetails, setConnectingFlightDetails] = useState([]);

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
  const [directFlightDetails, setDirectFlightDetail] = useState([]);
  const [sessionExpired, setSessionExpired] = useState(false);

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

  useEffect(() => {
    if (sessionStorage.length == 0) {
      navigate("/unauthorized");
    } else {
      if (mode == "singleTrip") {
        const directFlightDetails = sessionStorage.getItem("directflight");
        if (directFlightDetails) {
          const singleFlight = JSON.parse(directFlightDetails);
          setDirectFlightDetail(singleFlight);
          setfirstFlightScheduleId(singleFlight.ScheduleId);
          GetSeatsForSchedule(
            SanoshAirlineDetails.SanoshAirlines.apiPath,
            singleFlight.ScheduleId
          )
            .then((res) => {
              console.log(res);
              const firstres = res.map((flight) => capitalizeKeys(flight));
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
      } else if (mode == "connectingTrip") {
        const connectingFlightDetails =
          sessionStorage.getItem("connectingFlights");
        if (connectingFlightDetails) {
          const connectingFlights = JSON.parse(connectingFlightDetails);
          setConnectingFlightDetails(connectingFlights);
          setFirstConnectedFlightScheduleId(
            connectingFlights.firstflight.ScheduleId
          );
          setSecondConnectedFlightScheduleId(
            connectingFlights.secondflight.ScheduleId
          );
          console.log(connectingFlights.firstflight.apiPath);
          console.log(connectingFlights.secondflight.apiPath);
          GetSeatsForSchedule(
            connectingFlights.firstflight.apiPath,
            connectingFlights.firstflight.ScheduleId
          )
            .then((res) => {
              console.log(res);
              const seats = res.map((seat) => capitalizeKeys(seat));
              console.log(seats);
              setConnectingFlightFirstScheduleSeats(seats);
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
            connectingFlights.secondflight.apiPath,
            connectingFlights.secondflight.ScheduleId
          )
            .then((res) => {
              console.log(res);
              const seats = res.map((seat) => capitalizeKeys(seat));
              console.log(seats);
              setConnectingFlightSecondScheduleSeats(seats);
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
    }
  }, [mode, getUserDetails, refresh]);

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

  const arrangeSeats = (seats, setSeatRows, selectedSeats) => {
    const seatMap = {};
    const rows = [];
    const seatOrder = ["A", "B", "C", "gap", "D", "E", "F"]; // Placeholder for visual gap
  
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
        const isGap = row === "gap"; // Identifying the space element in the array
  
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
              ${isGap ? "hidden" : ""}`} // Hide the space element
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

    if (!updatedSelections.includes(selectedSeat)) {
      updatedSelections[index] = selectedSeat;
      setPassengerSeatSelections(updatedSelections);
    } else {
      toast.error("Cannot select the same seat for different passengers", {
        autoClose: 1000, // Set the duration in milliseconds (1 second in this case)
      });
    }
  };

  const bookFlight = (scheduleid, status, seatList) => {
    console.log(userDetails);

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
      sessionStorage.setItem(
        "SingleFlightBookingInfo",
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
    } else if (mode == "connectingTrip" && isFirstConnectedFlight) {
      const updatedPassengerDetails = userDetails.map((passenger, index) => ({
        ...passenger,
        SeatNo: passengerSeatSelections[index] || "",
      }));
      const detail = [updatedPassengerDetails];
      setConnectingFlightPassengerScheduleDetails(detail);
      console.log(connectingFlightDetails.firstflight.apiPath);

      ChangeSeatStatus(
        connectingFlightDetails.firstflight.apiPath,
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
        updatedPassengerDetails,
      ];
      setConnectingFlightPassengerScheduleDetails(combinedPassengerDetails);
      setRefresh(!refresh);
      console.log(connectingFlightPassengerScheduleDetails);
      sessionStorage.setItem(
        "ConnectingFlightBookingInfo",
        JSON.stringify(combinedPassengerDetails)
      );
      console.log(
        connectingFlightDetails.secondflight.apiPath,
        scheduleid,
        status,
        seatList
      );
      ChangeSeatStatus(
        connectingFlightDetails.secondflight.apiPath,
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
        <div className="flex flex-row flex-wrap p-4 md:p-10" ref={seatsRef}>
          <div className="w-full">
            {getUserDetails && (
              <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0">
                {(mode === "singleTrip" ||
                  (mode === "connectingTrip" && isFirstConnectedFlight)) && (
                  <div className="flex flex-col justify-center items-center text-center">
                    <div className="flex flex-col py-10">
                      <h1 className="text-3xl font-bold mb-4">
                        {mode === "singleTrip"
                          ? directFlightDetails.FlightName
                          : connectingFlightDetails.firstflight.FlightName}
                      </h1>
                      <div className="flex flex-row space-x-4">
                        <h1 className="text-lg font-semibold">
                          {mode === "singleTrip"
                            ? directFlightDetails.SourceAirportName
                            : connectingFlightDetails.firstflight
                                .SourceAirportName}
                        </h1>
                        <span className="text-lg font-semibold mx-2">- </span>
                        <h1 className="text-lg font-semibold">
                          {mode === "singleTrip"
                            ? directFlightDetails.DestinationAirportName
                            : connectingFlightDetails.firstflight
                                .DestinationAirportName}
                        </h1>
                      </div>
                    </div>
                    <SeatDisplay
                      seatlist={
                        mode === "singleTrip"
                          ? singleFlightSeatRows
                          : connectingFlightFirstSeatRows
                      }
                      book={() =>
                        bookFlight(
                          mode === "singleTrip"
                            ? firstFlightScheduleId
                            : firstConnectedFlightScheduleId,
                          "Booked",
                          mode === "singleTrip"
                            ? singleFlightSelectedSeats
                            : connectingFlightFirstSelectedSeats
                        )
                      }
                    />
                  </div>
                )}
                {mode === "connectingTrip" && isSecondConnectedFlight && (
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex flex-col py-10">
                      <h1 className="text-3xl font-bold mb-4">
                        {connectingFlightDetails.secondflight.FlightName}
                      </h1>
                      <div className="flex flex-row space-x-4">
                        <h1 className="text-lg font-semibold">
                          {
                            connectingFlightDetails.secondflight
                              .SourceAirportName
                          }
                        </h1>
                        <span className="text-lg font-semibold mx-2">-</span>
                        <h1 className="text-lg font-semibold">
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

          <div className="w-full md:w-1/2 mx-auto">
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

export default FlightBooking;
