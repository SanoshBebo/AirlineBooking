import React, { useEffect, useState } from "react";
import GetPassengerInfo from "../../components/GetPassengerInfo";
import SeatDisplay from "../../components/SeatDisplay";
import { useNavigate } from "react-router";
import { ToastContainer } from "react-toastify";
import { ChangeSeatStatus, GetSeatsForSchedule } from "../../api/Seat";

const RoundTripBooking = () => {
  const [flightno, setflightno] = useState(0);
  const [mode, setMode] = useState("");
  const [hasBookedFirstFlight, setHasBookedFirstFlight] = useState(false);
  const [hasBookedReturnFlight, setHasBookedReturnFlight] = useState(false);

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

  useEffect(() => {
    getFlightDetails();
  }, [getUserDetails, refresh]);

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
      console.log(roundTripDetails[flightno].firstflight.ScheduleId);
      console.log(roundTripDetails[flightno].secondflight.ScheduleId);
      GetSeatsForSchedule(roundTripDetails[flightno].firstflight.ScheduleId)
        .then((res) => {
          setConnectingFlightFirstScheduleSeats(res);
        })
        .catch((error) => {
          console.error(
            "Error fetching seats for first connecting flight:",
            error
          );
        });

      GetSeatsForSchedule(roundTripDetails[flightno].secondflight.ScheduleId)
        .then((res) => {
          setConnectingFlightSecondScheduleSeats(res);
        })
        .catch((error) => {
          console.error(
            "Error fetching seats for second connecting flight:",
            error
          );
        });
    } else {
      setMode("singleTrip");
      setfirstFlightScheduleId(roundTripDetails[flightno].ScheduleId);
      GetSeatsForSchedule(roundTripDetails[flightno].ScheduleId)
        .then((res) => {
          setSingleFlightScheduleSeats(res);
        })
        .catch((error) => {
          console.error("Error fetching seats for single flight:", error);
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

        ChangeSeatStatus(scheduleid, status, seatList)
          .then((res) => {
            if (mode == "singleTrip") {
              setSingleFlightSelectedSeats([]);
              setRefresh(!refresh);
              navigate("/FlightBooking/ConfirmBooking");
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        sessionStorage.setItem(
          "FlightOne",
          JSON.stringify(updatedPassengerDetails)
        );
        setflightno(1);
        ChangeSeatStatus(scheduleid, status, seatList)
          .then((res) => {
            if (mode == "singleTrip") {
              setSingleFlightSelectedSeats([]);
              setRefresh(!refresh);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    } else if (mode == "connectingTrip" && isFirstConnectedFlight) {
      const updatedPassengerDetails = userDetails.map((passenger, index) => ({
        ...passenger,
        SeatNo: passengerSeatSelections[index] || "",
      }));
      setConnectingFlightPassengerScheduleDetails(updatedPassengerDetails);
      ChangeSeatStatus(scheduleid, status, seatList)
        .then((res) => {
          if (mode == "connectingTrip" && isFirstConnectedFlight) {
            setIsSecondConnectedFlight(!isSecondConnectedFlight);
            setIsFirstConnectedFlight(!isFirstConnectedFlight);
            setRefresh(!refresh);
          }
        })
        .catch((err) => {
          console.error(err);
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
        console.log(combinedPassengerDetails)
        sessionStorage.setItem(
          "FlightTwo",
          JSON.stringify(combinedPassengerDetails)
        );
        ChangeSeatStatus(scheduleid, status, seatList)
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
          .catch((err) => {
            console.error(err);
          });
      } else if (flightno == 0) {
        setflightno(1);
        console.log(combinedPassengerDetails)
        sessionStorage.setItem(
          "FlightOne",
          JSON.stringify(combinedPassengerDetails)
        );

        ChangeSeatStatus(scheduleid, status, seatList)
          .then((res) => {
            if (mode == "connectingTrip" && isSecondConnectedFlight) {
              setConnectingFlightFirstSelectedSeats([]);
              setConnectingFlightSecondSelectedSeats([]);
              setIsSecondConnectedFlight(!isSecondConnectedFlight);
              setIsFirstConnectedFlight(!isFirstConnectedFlight);
              setRefresh(!refresh);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  };

  const arrangeSeats = (seats, setSeatRows, selectedSeats, setUpdateFlag) => {
    const seatMap = {};
    const rows = [];
    const seatOrder = ['A', 'B', 'C', 'D', 'E', 'F'];
  
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
        const isFirstGroup = index < 3; // Rows A, B, C
        const isSecondGroup = index >= 3; // Rows D, E, F
  
        return (
          <div
            key={seat ? seat.SeatNumber : `${row}-${i}`}
            className={`seat p-2 m-2 border  ${
              seat && selectedSeats.includes(seat.SeatNumber)
                ? 'bg-green-300 cursor-pointer'
                : seat && seat.Status === 'Available'
                ? 'bg-white cursor-pointer'
                : seat
                ? 'bg-gray-200 cursor-not-allowed disabled'
                : 'hidden'
            }`}
            onClick={() => seat && selectSeat(seat, mode)}
          >
            {seat && (seat.Status === 'Available' || seat.Status === 'Booked') ? seat.SeatNumber : ""}
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
      {getUserDetails &&
        ((mode === "singleTrip" && (
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
        )) ||
          (mode === "connectingTrip" && isFirstConnectedFlight && (
            <div>
              <h1>FirstFlight Connected Trip</h1>
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
          )) ||
          (mode === "connectingTrip" && isSecondConnectedFlight && (
            <div>
              <h1>SecondFlight Connected Trip</h1>
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
          )))}
      {getUserDetails &&
        userDetails.map((passenger, index) => (
          <div key={index}>
            <p>{passenger.Name}'s Seat:</p>
            <select
              value={passengerSeatSelections[index] || ""}
              onChange={(e) =>
                handlePassengerSeatSelection(index, e.target.value)
              }
            >
              <option value="">Select Seat</option>
              {mode == "singleTrip" &&
                singleFlightSelectedSeats.map((seat, seatIndex) => (
                  <option key={seatIndex} value={seat}>
                    {seat}
                  </option>
                ))}
              {mode == "connectingTrip" &&
                isFirstConnectedFlight &&
                connectingFlightFirstSelectedSeats.map((seat, seatIndex) => (
                  <option key={seatIndex} value={seat}>
                    {seat}
                  </option>
                ))}
              {mode == "connectingTrip" &&
                isSecondConnectedFlight &&
                connectingFlightSecondSelectedSeats.map((seat, seatIndex) => (
                  <option key={seatIndex} value={seat}>
                    {seat}
                  </option>
                ))}
            </select>
          </div>
        ))}
      <ToastContainer />
    </>
  );
};

export default RoundTripBooking;
