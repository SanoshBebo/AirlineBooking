import React, { useEffect, useState } from "react";
import {
  GetConnectionTickets,
  MakeBooking,
  MakePartnerBooking,
} from "../../api/Booking";
import userSlice, { loadUserFromStorage } from "../../redux/userSlice";
import { ChangeSeatStatus } from "../../api/Seat";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { airlinesapi } from "../../components/Constants";
import axios from "axios";

const ConfirmBooking = () => {
  const [PassengerDetails, setPassengerDetails] = useState([]);
  const [FlightScheduleDetails, setFlightScheduleDetails] = useState([]);
  const [connectingFlightBookingModel, setConnectingFlightBookingModel] =
    useState([]);
  const [userData, setUserData] = useState([]);
  const [flightType, setFlightType] = useState("");
  const [roundTripFirstflightType, setRoundTripFirstFlightType] = useState("");
  const [roundTripSecondflightType, setRoundTripSecondFlightType] =
    useState("");
  const [bookingType, setBookingType] = useState("");
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(true);

  const [firstFlightPassengerDetails, setFirstFlightPassengerDetails] =
    useState([]);
  const [firstFlightScheduleDetails, setFirstFlightScheduleDetails] = useState(
    []
  );
  const [secondFlightPassengerDetails, setSecondFlightPassengerDetails] =
    useState([]);
  const [secondFlightScheduleDetails, setSecondFlightScheduleDetails] =
    useState([]);
  const [isBookingReady, setIsBookingReady] = useState(false);

  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem("user"));
    setUserData(userdata);

    const SingleFlightPassengerDetails = JSON.parse(
      sessionStorage.getItem("SingleFlightBookingInfo")
    );

    const ConnectingFlightPassengerDetails = JSON.parse(
      sessionStorage.getItem("ConnectingFlightBookingInfo")
    );

    const RoundTripFirstFlightPassengerDetails = JSON.parse(
      sessionStorage.getItem("FlightOne")
    );

    const RoundTripSecondFlightPassengerDetails = JSON.parse(
      sessionStorage.getItem("FlightTwo")
    );

    if (
      RoundTripFirstFlightPassengerDetails &&
      RoundTripSecondFlightPassengerDetails
    ) {
      setBookingType("roundtrip");

      const RoundTripDetails = JSON.parse(
        sessionStorage.getItem("RoundTripDetails")
      );

      if (RoundTripDetails[0].firstflight) {
        setRoundTripFirstFlightType("connectingFlights");
        setFirstFlightScheduleDetails(RoundTripDetails[0]);
        setFirstFlightPassengerDetails(RoundTripFirstFlightPassengerDetails);
      } else {
        setRoundTripFirstFlightType("directflight");
        setFirstFlightScheduleDetails(RoundTripDetails[0]);
        setFirstFlightPassengerDetails(RoundTripFirstFlightPassengerDetails);
      }

      if (RoundTripDetails[1].firstflight) {
        setRoundTripSecondFlightType("connectingFlights");
        setSecondFlightScheduleDetails(RoundTripDetails[1]);
        setSecondFlightPassengerDetails(RoundTripSecondFlightPassengerDetails);
      } else {
        setRoundTripSecondFlightType("directflight");
        setSecondFlightScheduleDetails(RoundTripDetails[1]);
        setSecondFlightPassengerDetails(RoundTripSecondFlightPassengerDetails);
      }
    }

    if (SingleFlightPassengerDetails) {
      const FlightDetails = JSON.parse(sessionStorage.getItem("directflight"));
      setFlightScheduleDetails(FlightDetails);
      setPassengerDetails(SingleFlightPassengerDetails);
      setFlightType("directflight");
    } else if (ConnectingFlightPassengerDetails) {
      const FlightDetails = JSON.parse(
        sessionStorage.getItem("connectingFlights")
      );
      setFlightScheduleDetails(FlightDetails);
      console.log(FlightDetails);
      setPassengerDetails(ConnectingFlightPassengerDetails);
      console.log(ConnectingFlightPassengerDetails);
      setFlightType("connectingFlights");
    }
  }, [refresh]);

  useEffect(() => {
    if (isBookingReady) {
      const makeBooking = async () => {
        console.log(connectingFlightBookingModel);
        const bookingid = await MakeBooking(connectingFlightBookingModel);
        console.log(bookingid);

        const result = await GetConnectionTickets(bookingid);
        console.log(result);

        result.map(async (Ticket) => {
          const airline = airlinesapi[Ticket.AirlineName];
          console.log(airline.apiPath);
          console.log(`${airline.apiPath}Integration/partnerbooking`);
          try {
            const response = await axios.post(
              `${airline.apiPath}Integration/partnerbooking`,
              JSON.stringify([Ticket]),
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
          } catch (error) {
            console.error(error);
            throw error;
          }
        });

        setIsBookingReady(false);
        sessionStorage.clear("");
        navigate("/BookingHistory");
      };
      makeBooking();
    }
  }, [isBookingReady, connectingFlightBookingModel]);

  const handleConfirmBooking = async () => {
    if (bookingType == "roundtrip") {
      if (roundTripFirstflightType == "directflight") {
        let BookingModel = {
          Status: "Booked",
          PassengerInfos: firstFlightPassengerDetails,
          UserId: userData.UserId,
          BookingType: "Round Trip",
          ScheduleId: firstFlightScheduleDetails.ScheduleId,
          DateTime: firstFlightScheduleDetails.DateTime,
          DestinationAirportId: firstFlightScheduleDetails.DestinationAirportId,
          FlightName: firstFlightScheduleDetails.FlightName,
          SourceAirportId: firstFlightScheduleDetails.SourceAirportId,
          AirlineName: "SanoshAirlines",
        };
        let data = [BookingModel];
        setConnectingFlightBookingModel([BookingModel]);
        console.log(connectingFlightBookingModel);
      } else if (roundTripFirstflightType == "connectingFlights") {
        let halfIndex = Math.floor(firstFlightPassengerDetails.length / 2);
        let firstHalfPassengerDetails = firstFlightPassengerDetails.slice(
          0,
          halfIndex
        );
        let secondHalfPassengerDetails =
          firstFlightPassengerDetails.slice(halfIndex);

        let firstFlightBookingModel = {
          Status: "Booked",
          PassengerInfos: firstHalfPassengerDetails,
          UserId: userData.UserId,
          BookingType: "Round Trip",
          ScheduleId: firstFlightScheduleDetails.firstflight.ScheduleId,
          DateTime: firstFlightScheduleDetails.firstflight.DateTime,
          DestinationAirportId:
            firstFlightScheduleDetails.firstflight.DestinationAirportId,
          FlightName: firstFlightScheduleDetails.firstflight.FlightName,
          SourceAirportId:
            firstFlightScheduleDetails.firstflight.SourceAirportId,
          AirlineName: "SanoshAirlines",
        };

        let secondFlightBookingModel = {
          Status: "Booked",
          PassengerInfos: secondHalfPassengerDetails,
          UserId: userData.UserId,
          BookingType: "Round Trip",
          ScheduleId: firstFlightScheduleDetails.secondflight.ScheduleId,
          DateTime: firstFlightScheduleDetails.secondflight.DateTime,
          DestinationAirportId:
            firstFlightScheduleDetails.secondflight.DestinationAirportId,
          FlightName: firstFlightScheduleDetails.secondflight.FlightName,
          SourceAirportId:
            firstFlightScheduleDetails.secondflight.SourceAirportId,
          AirlineName: "SanoshAirlines",
        };
        let combined = [firstFlightBookingModel, secondFlightBookingModel];
        setConnectingFlightBookingModel(combined);
        console.log(connectingFlightBookingModel);
      }

      await new Promise((resolve) => setTimeout(resolve, 0));

      if (roundTripSecondflightType == "directflight") {
        let BookingModel = {
          Status: "Booked",
          PassengerInfos: secondFlightPassengerDetails,
          UserId: userData.UserId,
          BookingType: "Round Trip",
          ScheduleId: secondFlightScheduleDetails.ScheduleId,
          DateTime: secondFlightScheduleDetails.DateTime,
          DestinationAirportId:
            secondFlightScheduleDetails.DestinationAirportId,
          FlightName: secondFlightScheduleDetails.FlightName,
          SourceAirportId: secondFlightScheduleDetails.SourceAirportId,
          AirlineName: "SanoshAirlines",
        };
        setConnectingFlightBookingModel((prevState) => [
          ...prevState,
          BookingModel,
        ]);
      } else if (roundTripSecondflightType == "connectingFlights") {
        let halfIndex = Math.floor(secondFlightPassengerDetails.length / 2);
        let firstHalfPassengerDetails = secondFlightPassengerDetails.slice(
          0,
          halfIndex
        );
        let secondHalfPassengerDetails =
          secondFlightPassengerDetails.slice(halfIndex);

        let firstFlightBookingModel = {
          Status: "Booked",
          PassengerInfos: firstHalfPassengerDetails,
          UserId: userData.UserId,
          BookingType: "Round Trip",
          ScheduleId: secondFlightScheduleDetails.firstflight.ScheduleId,
          DateTime: secondFlightScheduleDetails.firstflight.DateTime,
          DestinationAirportId:
            secondFlightScheduleDetails.firstflight.DestinationAirportId,
          FlightName: secondFlightScheduleDetails.firstflight.FlightName,
          SourceAirportId:
            secondFlightScheduleDetails.firstflight.SourceAirportId,
          AirlineName: "SanoshAirlines",
        };

        let secondFlightBookingModel = {
          Status: "Booked",
          PassengerInfos: secondHalfPassengerDetails,
          UserId: userData.UserId,
          BookingType: "Round Trip",
          ScheduleId: secondFlightScheduleDetails.secondflight.ScheduleId,
          DateTime: secondFlightScheduleDetails.secondflight.DateTime,
          DestinationAirportId:
            secondFlightScheduleDetails.secondflight.DestinationAirportId,
          FlightName: secondFlightScheduleDetails.secondflight.FlightName,
          SourceAirportId:
            secondFlightScheduleDetails.secondflight.SourceAirportId,
          AirlineName: "SanoshAirlines",
        };
        let combined = [firstFlightBookingModel, secondFlightBookingModel];
        setConnectingFlightBookingModel((prevState) => [
          ...prevState,
          ...combined,
        ]);
      }
    } else if (flightType == "connectingFlights") {
      let firstFlightBookingModel = {
        Status: "Booked",
        PassengerInfos: PassengerDetails[0],
        UserId: userData.UserId,
        BookingType: "Onward",
        ScheduleId: FlightScheduleDetails.firstflight.ScheduleId,
        DateTime: FlightScheduleDetails.firstflight.DateTime,
        DestinationAirportId:
          FlightScheduleDetails.firstflight.DestinationAirportId,
        FlightName: FlightScheduleDetails.firstflight.FlightName,
        SourceAirportId: FlightScheduleDetails.firstflight.SourceAirportId,
        AirlineName: "AbhiramAirlines",
      };

      let secondFlightBookingModel = {
        Status: "Booked",
        PassengerInfos: PassengerDetails[1],
        UserId: userData.UserId,
        BookingType: "Onward",
        ScheduleId: FlightScheduleDetails.secondflight.ScheduleId,
        DateTime: FlightScheduleDetails.secondflight.DateTime,
        DestinationAirportId:
          FlightScheduleDetails.secondflight.DestinationAirportId,
        FlightName: FlightScheduleDetails.secondflight.FlightName,
        SourceAirportId: FlightScheduleDetails.secondflight.SourceAirportId,
        AirlineName: "AbhiramAirlines",
      };

      console.log(...connectingFlightBookingModel);
      console.log(connectingFlightBookingModel);

      let data = [
        ...connectingFlightBookingModel,
        firstFlightBookingModel,
        secondFlightBookingModel,
      ];
      setConnectingFlightBookingModel(data);
    } else if (flightType == "directflight") {
      let BookingModel = [
        {
          Status: "Booked",
          PassengerInfos: PassengerDetails,
          UserId: userData.UserId,
          BookingType: "Onward",
          ScheduleId: FlightScheduleDetails.ScheduleId,
          DateTime: FlightScheduleDetails.DateTime,
          DestinationAirportId: FlightScheduleDetails.DestinationAirportId,
          FlightName: FlightScheduleDetails.FlightName,
          SourceAirportId: FlightScheduleDetails.SourceAirportId,
          AirlineName: "SanoshAirlines",
        },
      ];
      setConnectingFlightBookingModel(BookingModel);
    }

    setIsBookingReady(true);
  };

  const handleCancelBooking = () => {
    if (bookingType == "roundtrip") {
      console.log(firstFlightPassengerDetails);
      console.log(secondFlightPassengerDetails);
      console.log(firstFlightScheduleDetails, secondFlightScheduleDetails);
      if (roundTripFirstflightType == "directflight") {
        const firstseat = firstFlightPassengerDetails.map(
          (passenger) => passenger.SeatNo
        );
        console.log(firstFlightScheduleDetails);
        ChangeSeatStatus(
          firstFlightScheduleDetails.ScheduleId,
          "Available",
          firstseat
        )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        let halfIndex = Math.floor(secondFlightPassengerDetails.length / 2);
        let firstHalfPassengerDetails = firstFlightPassengerDetails.slice(
          0,
          halfIndex
        );
        let secondHalfPassengerDetails =
          firstFlightPassengerDetails.slice(halfIndex);

        const firstseats = firstHalfPassengerDetails.map(
          (passenger) => passenger.SeatNo
        );
        const secondseats = secondHalfPassengerDetails.map(
          (passenger) => passenger.SeatNo
        );

        console.log(firstFlightScheduleDetails);
        ChangeSeatStatus(
          firstFlightScheduleDetails.firstflight.ScheduleId,
          "Available",
          firstseats
        )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.error(err);
          });
        ChangeSeatStatus(
          firstFlightScheduleDetails.secondflight.ScheduleId,
          "Available",
          secondseats
        )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.error(err);
          });
      }
      if (roundTripSecondflightType == "directflight") {
        const secondseat = secondFlightPassengerDetails.map(
          (passenger) => passenger.SeatNo
        );
        console.log(secondFlightScheduleDetails);

        ChangeSeatStatus(
          secondFlightScheduleDetails.ScheduleId,
          "Available",
          secondseat
        )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        let halfIndex = Math.floor(secondFlightPassengerDetails.length / 2);
        let firstHalfPassengerDetails = firstFlightPassengerDetails.slice(
          0,
          halfIndex
        );
        let secondHalfPassengerDetails =
          firstFlightPassengerDetails.slice(halfIndex);
        const firstseats = firstHalfPassengerDetails.map(
          (passenger) => passenger.SeatNo
        );
        const secondseats = secondHalfPassengerDetails.map(
          (passenger) => passenger.SeatNo
        );

        console.log(secondFlightScheduleDetails);
        ChangeSeatStatus(
          secondFlightScheduleDetails.firstflight.ScheduleId,
          "Available",
          firstseats
        )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.error(err);
          });
        ChangeSeatStatus(
          secondFlightScheduleDetails.secondflight.ScheduleId,
          "Available",
          secondseats
        )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    } else {
      if(flightType == "directflight"){

      }else if(flightType == "connectingFlights")

      console.log(PassengerDetails)
      const passengerDetailList = PassengerDetails.flat();

      console.log(FlightScheduleDetails.firstflight.ScheduleId,FlightScheduleDetails.secondflight.ScheduleId)
     
     
      let halfIndex = Math.floor(passengerDetailList.length / 2);
        let firstHalfPassengerDetails = passengerDetailList.slice(
          0,
          halfIndex
        );
        let secondHalfPassengerDetails =
        passengerDetailList.slice(halfIndex);


        const firstseats = firstHalfPassengerDetails.map(
          (passenger) => passenger.SeatNo
        );
        const secondseats = secondHalfPassengerDetails.map(
          (passenger) => passenger.SeatNo
        );

          console.log(firstseats)
          console.log(secondseats)

      ChangeSeatStatus(FlightScheduleDetails.firstflight.apiPath,FlightScheduleDetails.firstflight.ScheduleId, "Available", firstseats)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });

      ChangeSeatStatus(FlightScheduleDetails.secondflight.apiPath,FlightScheduleDetails.secondflight.ScheduleId, "Available", secondseats)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    }
    navigate("/userhome");
  };

  return (
    <div className="m-5 flex flex-col">
      <div>
        <ul className="divide-y divide-gray-300">
          {flightType === "directflight" &&
            PassengerDetails.map((Passenger) => (
              <li
                key={Passenger.SeatNo}
                className="flex items-center justify-between py-3 px-4 hover:bg-gray-100"
              >
                <div className="flex flex-col space-y-1">
                  <p className="text-lg font-semibold">{Passenger.Name}</p>
                  <p className="text-sm text-gray-600">{Passenger.SeatNo}</p>
                </div>
                <div className="flex flex-col text-right">
                  <p className="text-sm">
                    {FlightScheduleDetails.FlightName} -{" "}
                    {FlightScheduleDetails.FlightDuration}
                  </p>
                  <p className="text-xs text-gray-500">
                    {FlightScheduleDetails.SourceAirportId} -{" "}
                    {FlightScheduleDetails.DestinationAirportId} -{" "}
                    {FlightScheduleDetails.DateTime}
                  </p>
                </div>
              </li>
            ))}

          {flightType === "connectingFlights" &&
            PassengerDetails[0].map((Passenger) => (
              <li
                key={Passenger.SeatNo}
                className="flex items-center justify-between py-3 px-4 hover:bg-gray-100"
              >
                <div className="flex flex-col space-y-1">
                  <p className="text-lg font-semibold">{Passenger.Name}</p>
                  <p className="text-sm text-gray-600">{Passenger.SeatNo}</p>
                </div>
                <div className="flex flex-col text-right">
                  <p className="text-sm">
                    {FlightScheduleDetails.firstflight.FlightName} -{" "}
                    {FlightScheduleDetails.firstflight.FlightDuration}
                  </p>
                  <p className="text-xs text-gray-500">
                    {FlightScheduleDetails.firstflight.SourceAirportId} -{" "}
                    {FlightScheduleDetails.firstflight.DestinationAirportId} -{" "}
                    {FlightScheduleDetails.firstflight.DateTime.split("T")[0]}{" "}
                    {FlightScheduleDetails.firstflight.DateTime.split("T")[1]}
                  </p>
                </div>
              </li>
            ))}

          {flightType === "connectingFlights" &&
            PassengerDetails[1].map((Passenger) => (
              <li
                key={Passenger.SeatNo}
                className="flex items-center justify-between py-3 px-4 hover:bg-gray-100"
              >
                <div className="flex flex-col space-y-1">
                  <p className="text-lg font-semibold">{Passenger.Name}</p>
                  <p className="text-sm text-gray-600">{Passenger.SeatNo}</p>
                </div>
                <div className="flex flex-col text-right">
                  <p className="text-sm">
                    {FlightScheduleDetails.secondflight.FlightName} -{" "}
                    {FlightScheduleDetails.secondflight.FlightDuration}
                  </p>
                  <p className="text-xs text-gray-500">
                    {FlightScheduleDetails.secondflight.SourceAirportId} -{" "}
                    {FlightScheduleDetails.secondflight.DestinationAirportId} -{" "}
                    {FlightScheduleDetails.secondflight.DateTime.split("T")[0]}{" "}
                    {FlightScheduleDetails.secondflight.DateTime.split("T")[1]}
                  </p>
                </div>
              </li>
            ))}
        </ul>
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mt-6 mb-4">Confirm Flight Booking</h1>
        <div className="flex space-x-4">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md"
            onClick={() => handleConfirmBooking()}
          >
            Yes
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md"
            onClick={() => handleCancelBooking()}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmBooking;
