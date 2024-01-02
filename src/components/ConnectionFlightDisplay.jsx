import React, { useState } from "react";
import {
  calculateArrivalDateTime,
  formatDate,
} from "../helper_functions/DateTimeFormatter";

const ConnectionFlightDisplay = ({
  data,
  onClick,
  mode,
  bookButtonVisibility,
}) => {
  console.log(data, onClick, mode);

  const [clickedIndex, setClickedIndex] = useState(null);

  const handleDivClick = (index) => {
    // Set the clicked index to the index of the flight that was clicked
    setClickedIndex(index);
  };

  return (
    <>
      {mode && (
        <div className="w-full">
          {data.map((connection, index) => (
            <div key={index} className="">
              {connection.SecondFlight.map((flight, i) => (
                <div
                  key={i}
                  className={`flex flex-col-reverse border p-5 md:p-10 rounded-md bg-white hover:bg-gray-100 my-4 transition duration-300 ease-in-out`}
                >
                  <div className="flex flex-row">
                    <div className="-mx-0 bg-red-400 rounded-sm">
                      <p className="p-2 text-white">ONE STOP</p>
                    </div>
                    {!bookButtonVisibility && (
                      <div
                        className="mx-auto bg-red-400 rounded-sm cursor-pointer "
                        onClick={() =>
                          mode === "oneway"
                            ? onClick(
                                flight,
                                connection.FirstFlight,
                                "connectingTrip"
                              )
                            : onClick(connection.FirstFlight, flight)
                        }
                      >
                        <p
                          className={`p-2  text-white ${
                            flight.SeatAvailability === 0 ||
                            connection.FirstFlight.SeatAvailability === 0
                              ? "disabled:"
                              : "visible"
                          }`}
                        >
                          Book Now
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 md:p-5">
                    <ul>
                      <div className="flex items-center space-x-2 justify-between">
                        <p className="text-lg font-semibold text-[#003366]">
                          {flight.FlightName}
                        </p>
                        <p className="text-red-500 p-2 rounded-md">
                          Seats Left: {flight.SeatAvailability}
                        </p>
                      </div>
                      <div className="flex flex-row justify-between p-2 flex-wrap">
                        <div className="flex flex-col p-1">
                          <p>{flight.SourceAirportName}</p>
                          <p>{formatDate(flight.DateTime)}</p>
                        </div>
                        <div className="flex flex-col p-1">
                          <p>Flight Duration</p>
                          <p>{flight.FlightDuration}</p>
                        </div>
                        <div className="flex flex-col  p-1">
                          <p>{flight.DestinationAirportName}</p>
                          <p>
                            {calculateArrivalDateTime(
                              flight.DateTime,
                              flight.FlightDuration
                            )}
                          </p>
                        </div>
                      </div>
                    </ul>
                  </div>

                  <div className="p-3 md:p-5">
                    <ul>
                      <div className="flex items-center space-x-2 justify-between">
                        <p className="text-lg font-semibold text-purple-600">
                          {connection.FirstFlight.FlightName}
                        </p>
                        <p className="text-red-500 p-2 rounded-md">
                          Seats Left: {flight.SeatAvailability}
                        </p>
                      </div>
                      <div className="flex flex-row justify-between p-2 flex-wrap">
                        <div className="flex flex-col">
                          <p>{connection.FirstFlight.SourceAirportName}</p>
                          <p>{formatDate(connection.FirstFlight.DateTime)}</p>
                        </div>
                        <div className="flex flex-col">
                          <p>Flight Duration</p>
                          <p>{connection.FirstFlight.FlightDuration}</p>
                        </div>
                        <div className="flex flex-col">
                          <p>{connection.FirstFlight.DestinationAirportName}</p>
                          <p>
                            {calculateArrivalDateTime(
                              connection.FirstFlight.DateTime,
                              connection.FirstFlight.FlightDuration
                            )}
                          </p>
                        </div>
                      </div>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ConnectionFlightDisplay;
