import React, { useEffect, useState } from 'react'
import GetPassengerInfo from '../../components/GetPassengerInfo';
import SeatDisplay from '../../components/SeatDisplay';
import { useNavigate } from 'react-router';

const RoundTripBooking = () => {

    const [hasBookedFirstFlight, setHasBookedFirstFlight] = useState(false)
    const [hasBookedReturnFlight, setHasBookedReturnFlight] = useState(false)

    
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

  const [selectedSeatsForPassengers, setSelectedSeatsForPassengers] = useState([]);
  const [connectingFlightPassengerScheduleDetails, setConnectingFlightPassengerScheduleDetails] = useState([]);

const navigate = useNavigate()

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

    useEffect(() => {
        const roundTripDetails =
        JSON.parse(sessionStorage.getItem("RoundTripDetails"));

        if(roundTripDetails[0].firstflight){
            setFirstConnectedFlightScheduleId(
                roundTripDetails[0].firstflight.ScheduleId
              );
              setSecondConnectedFlightScheduleId(
                roundTripDetails[0].secondflight.ScheduleId
              );
      
              GetSeatsForSchedule(roundTripDetails[0].firstflight.ScheduleId)
                .then((res) => {
                  setConnectingFlightFirstScheduleSeats(res);
                })
                .catch((error) => {
                  console.error(
                    "Error fetching seats for first connecting flight:",
                    error
                  );
                });
      
              GetSeatsForSchedule(roundTripDetails[0].secondflight.ScheduleId)
                .then((res) => {
                  setConnectingFlightSecondScheduleSeats(res);
                })
                .catch((error) => {
                  console.error(
                    "Error fetching seats for second connecting flight:",
                    error
                  );
                });
        }else{
            setfirstFlightScheduleId(roundTripDetails[0].ScheduleId);
            GetSeatsForSchedule(roundTripDetails[0].ScheduleId)
              .then((res) => {
                setSingleFlightScheduleSeats(res);
              })
              .catch((error) => {
                console.error("Error fetching seats for single flight:", error);
              });
        }


        if(roundTripDetails[1].firstflight){
            setFirstConnectedFlightScheduleId(
                roundTripDetails[1].firstflight.ScheduleId
              );
              setSecondConnectedFlightScheduleId(
                roundTripDetails[1].secondflight.ScheduleId
              );
      
              GetSeatsForSchedule(roundTripDetails[1].firstflight.ScheduleId)
                .then((res) => {
                  setConnectingFlightFirstScheduleSeats(res);
                })
                .catch((error) => {
                  console.error(
                    "Error fetching seats for first connecting flight:",
                    error
                  );
                });
      
              GetSeatsForSchedule(roundTripDetails[1].secondflight.ScheduleId)
                .then((res) => {
                  setConnectingFlightSecondScheduleSeats(res);
                })
                .catch((error) => {
                  console.error(
                    "Error fetching seats for second connecting flight:",
                    error
                  );
                });
        }else{
            setfirstFlightScheduleId(roundTripDetails[1].ScheduleId);
            GetSeatsForSchedule(roundTripDetails[1].ScheduleId)
              .then((res) => {
                setSingleFlightScheduleSeats(res);
              })
              .catch((error) => {
                console.error("Error fetching seats for single flight:", error);
              });
        }
    }, [mode,getUserDetails,refresh])

    
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

    if(mode == "singleTrip"){
      const updatedPassengerDetails = userDetails.map((passenger, index) => ({
        ...passenger,
        SeatNo: passengerSeatSelections[index] || '',
      }));
      sessionStorage.setItem("SingleFlightBookingInfo",JSON.stringify(updatedPassengerDetails))
      setIsConfirmBooking(!isConfirmBooking);
      navigate("/FlightBooking/ConfirmBooking");
    }else if(mode == "connectingTrip" && isFirstConnectedFlight){
      const updatedPassengerDetails = userDetails.map((passenger, index) => ({
        ...passenger,
        SeatNo: passengerSeatSelections[index] || '',
      }));
      const detail = [updatedPassengerDetails]
      setConnectingFlightPassengerScheduleDetails(detail);
      setRefresh(!refresh);
      console.log(connectingFlightPassengerScheduleDetails);
    }
    else if(mode == "connectingTrip" && isSecondConnectedFlight){
      const updatedPassengerDetails = userDetails.map((passenger, index) => ({
        ...passenger,
        SeatNo: passengerSeatSelections[index] || '',
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
      navigate("/FlightBooking/ConfirmBooking");
    }

    ChangeSeatStatus(scheduleid, status, seatList)
      .then((res) => {
        if (mode == "singleTrip") {
          setSingleFlightSelectedSeats([])
          setRefresh(!refresh)
        }

        else if (mode == "connectingTrip" && isSecondConnectedFlight) {
          setIsSecondConnectedFlight(false);
          setRefresh(!refresh)
        }

        else if (mode == "connectingTrip" && isFirstConnectedFlight) {
          setIsSecondConnectedFlight(!isSecondConnectedFlight);
          setIsFirstConnectedFlight(!isFirstConnectedFlight);
          setRefresh(!refresh);
        }

      })
      .catch((err) => {
        console.error(err);
      });

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
                className={`seat p-2 m-2 border ${
                  seat && selectedSeats.includes(seat.SeatNumber)
                    ? 'bg-green-300 cursor-pointer'
                    : seat && seat.Status === 'Available'
                    ? 'bg-white cursor-pointer'
                    : 'bg-gray-200 cursor-not-allowed disabled '
                }`}
                onClick={() => seat && selectSeat(seat, mode)}
              >
                {seat ? seat.SeatNumber : ""}
              </div>
            );
          });
      
          rows.push(
            <div key={i} className="seat-row flex">
              <div className="flex seat-group">
                {formattedRow.slice(0, 3)} {/* Display ABC group */}
              </div>
              <div className="w-4" />
              <div className="flex seat-group">
                {formattedRow.slice(3)} {/* Display DEF group */}
              </div>
            </div>
          );
        }
      
        setSeatRows(rows);
      };
      
        const selectSeat = (seat, mode) => {
          if (mode === 'singleTrip') {
            setSingleFlightSelectedSeats((prevSelectedSeats) => {
              if (prevSelectedSeats.includes(seat.SeatNumber)) {
                return prevSelectedSeats.filter(
                  (selectedSeat) => selectedSeat !== seat.SeatNumber
                );
              } else if (singleFlightSelectedSeats.length < userDetails.length && seat.Status === 'Available') {
                return [...prevSelectedSeats, seat.SeatNumber];
              } else {
                return prevSelectedSeats;
              }
            });
          } else if (mode === 'connectingTrip') {
            if (isFirstConnectedFlight) {
              setConnectingFlightFirstSelectedSeats((prevSelectedSeats) => {
                if (prevSelectedSeats.includes(seat.SeatNumber)) {
                  return prevSelectedSeats.filter(
                    (selectedSeat) => selectedSeat !== seat.SeatNumber
                  );
                } else if (connectingFlightFirstSelectedSeats.length < userDetails.length && seat.Status === 'Available') {
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
                } else if (connectingFlightSecondSelectedSeats.length < userDetails.length && seat.Status === 'Available') {
                  return [...prevSelectedSeats, seat.SeatNumber];
                } else {
                  return prevSelectedSeats;
                }
              });
            }
          }
      
          if (mode === 'singleTrip' || mode === 'connectingTrip') {
            if (userDetails.length > 0) {
              let newSelectedSeatsForPassengers = [];
      
              userDetails.forEach((passenger, index) => {
                if (selectedSeatsForPassengers[index] === undefined) {
                  newSelectedSeatsForPassengers.push({
                    ...passenger,
                    seatno: '',
                  });
                } else {
                  newSelectedSeatsForPassengers.push(selectedSeatsForPassengers[index]);
                }
              });
      
              newSelectedSeatsForPassengers = newSelectedSeatsForPassengers.map(
                (passenger, index) => {
                  if (index === userDetails.length - 1 && passenger.seatno === '') {
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
    {getUserDetails && (
      (mode === 'singleTrip' && (
        <SeatDisplay
          seatlist={singleFlightSeatRows}
          book={() =>
            bookFlight(firstFlightScheduleId, 'Booked', singleFlightSelectedSeats)
          }
        />
      )) ||
      ((mode === 'connectingTrip' && isFirstConnectedFlight && (
        <div>
          <h1>FirstFlight Connected Trip</h1>
        <SeatDisplay
          seatlist={connectingFlightFirstSeatRows}
          book={() =>
            bookFlight(
              firstConnectedFlightScheduleId,
              'Booked',
              connectingFlightFirstSelectedSeats
              )
            }
            />
            </div>
      )) ||
        (mode === 'connectingTrip' && isSecondConnectedFlight && (
          <div>
          <h1>SecondFlight Connected Trip</h1>
          <SeatDisplay
            seatlist={connectingFlightSecondSeatRows}
            book={() =>
              bookFlight(
                secondConnectedFlightScheduleId,
                'Booked',
                connectingFlightSecondSelectedSeats
              )
            }
          />
        </div>
        )))
    )}
      {getUserDetails &&
      userDetails.map((passenger, index) => (
        <div key={index}>
          <p>{passenger.Name}'s Seat:</p>
          <select
            value={passengerSeatSelections[index] || ''}
            onChange={(e) => handlePassengerSeatSelection(index, e.target.value)}
          >
            <option value="">Select Seat</option>
            {mode=="singleTrip" && singleFlightSelectedSeats.map((seat, seatIndex) => (
              <option key={seatIndex} value={seat}>
                {seat}
              </option>
            ))}
            {mode=="connectingTrip" && isFirstConnectedFlight && connectingFlightFirstSelectedSeats.map((seat, seatIndex) => (
              <option key={seatIndex} value={seat}>
                {seat}
              </option>
            ))}
            {mode=="connectingTrip" && isSecondConnectedFlight && connectingFlightSecondSelectedSeats.map((seat, seatIndex) => (
              <option key={seatIndex} value={seat}>
                {seat}
              </option>
            ))}
          </select>
        </div>
      ))}
    <ToastContainer />
  </>
  )
}

export default RoundTripBooking