import React from "react";
import {
  calculateArrivalDateTime,
  formatDate,
} from "../helper_functions/DateTimeFormatter";
const DirectFlightDisplay = ({ data, onClick, mode, bookButtonVisibility }) => {
  console.log(data, onClick, mode);

  return (
    <>
      {mode && ( // Check if mode is "roundtrip"
        <div className="w-full">
        <ul>
          {data.map((flight) => (
            <li
              key={flight.ScheduleId}
              className="flex flex-col items-start mt-4 p-5 md:p-10 border-b border border-1 bg-white hover:bg-gray-100 rounded"
            >
              <div className="w-full">
                <p className="flex items-center space-x-2 justify-between">
                  <span className="text-lg font-semibold text-[#003366]">
                    {flight.FlightName}
                  </span>
                  <div className="mx-auto mt-2 rounded-sm hover:cursor-pointer ">
                    <p className="text-red-500 p-2 rounded-md">
                      Seats Left: {flight.SeatAvailability}
                    </p>
                  </div>
                </p>
                <div className="flex flex-col md:flex-row justify-between p-2 flex-wrap">
                  <div className="flex flex-col">
                    <p>{flight.SourceAirportName}</p>
                    <p>{formatDate(flight.DateTime)}</p>
                  </div>
                  <div className="flex flex-col">
                    <p>Flight Duration</p>
                    <p>{flight.FlightDuration}</p>
                  </div>
                  <div className="flex flex-col">
                    <p>{flight.DestinationAirportName}</p>
                    <p>
                      {calculateArrivalDateTime(
                        flight.DateTime,
                        flight.FlightDuration
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-row w-full items-center justify-center flex-wrap">
                <div className="-mx-0 mt-2 bg-red-400 rounded-sm">
                  <p className="text-white p-2 rounded-md">NON STOP</p>
                </div>
                {!bookButtonVisibility && (
                  <div
                    className="mx-auto mt-2 bg-red-400 rounded-sm hover:cursor-pointer "
                    onClick={() =>
                      mode == "roundtrip"
                        ? onClick(flight)
                        : onClick(flight, "singleTrip")
                    }
                  >
                    <p className="text-white p-2 rounded-md">Book Now</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      )}
    </>
  );
};

export default DirectFlightDisplay;
