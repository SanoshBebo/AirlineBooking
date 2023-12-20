import React, { useState } from "react";

const ConnectionFlightDisplay = ({ data, onClick, mode }) => {
  console.log(data, onClick, mode);


  const [clickedIndex, setClickedIndex] = useState(null);

  const handleDivClick = (index) => {
    // Set the clicked index to the index of the flight that was clicked
    setClickedIndex(index);
  };



  return (
    <>
      {mode == "oneway" && (
        <div className="">
          {data.map((connection, index) => (
            <div key={index} className="flex justify-between">
              <div className="">
                {connection.SecondFlight.map((flight, i) => (
                  <div
                    key={i}
                    className={`flex flex-row-reverse border p-4 rounded-md cursor-pointer bg-gray-100   hover:bg-gray-100 my-4 transition duration-300 ease-in-out`}
                    onClick={() =>
                      onClick(flight, connection.FirstFlight, "connectingTrip")
                    }
                  >
                    <div className="p-5">
                      <ul>
                        <li className="font-bold text-blue-600">
                          {flight.FlightName}
                        </li>
                        <li>{flight.SourceAirportName}</li>
                        <li>{flight.DestinationAirportName}</li>
                        <li>Flight Duration: {flight.FlightDuration}</li>
                        <li>Departure Date: {flight.DateTime.split("T")[0]}</li>
                        <li>Departure Time: {flight.DateTime.split("T")[1]}</li>
                      </ul>
                    </div>
                    <div className="p-5">
                      <ul>
                        <li className="font-bold text-blue-600">
                          {connection.FirstFlight.FlightName}
                        </li>
                        <li>{connection.FirstFlight.SourceAirportName}</li>
                        <li>{connection.FirstFlight.DestinationAirportName}</li>
                        <li>
                          Flight Duration:{" "}
                          {connection.FirstFlight.FlightDuration}
                        </li>
                        <li>
                          Departure Date:{" "}
                          {connection.FirstFlight.DateTime.split("T")[0]}
                        </li>
                        <li>
                          Departure Time:{" "}
                          {connection.FirstFlight.DateTime.split("T")[1]}
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

{mode === "roundtrip" && (
        <div className="">
          {data.map((connection, index) => (
            <div key={index} className="flex flex-col justify-between">
              {connection.SecondFlight.map((flight, flightIndex) => {
                // Calculate a unique index for each flight
                const uniqueIndex = `${index}-${flightIndex}`;
                return (
                  <div
                    key={uniqueIndex}
                    className={`flex flex-row border p-4 rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200 my-4 transition duration-300 ease-in-out ${
                      clickedIndex === uniqueIndex ? "bg-green-200" : ""
                    }`}
                    onClick={() => {
                      handleDivClick(uniqueIndex);
                      onClick(connection.FirstFlight, flight);
                    }}
                  >
                    <div className="p-5">
                      <ul>
                        <li className="font-bold text-purple-600">
                          {flight.FlightName}
                        </li>
                        <li>{flight.SourceAirportName}</li>
                        <li>{flight.DestinationAirportName}</li>
                        <li>Flight Duration: {flight.FlightDuration}</li>
                        <li>Departure Date: {flight.DateTime.split("T")[0]}</li>
                        <li>Departure Time: {flight.DateTime.split("T")[1]}</li>
                      </ul>
                    </div>
                    <div className="p-5">
                      <ul>
                        <li className="font-bold text-purple-600">
                          {connection.FirstFlight.FlightName}
                        </li>
                        <li>{connection.FirstFlight.SourceAirportName}</li>
                        <li>{connection.FirstFlight.DestinationAirportName}</li>
                        <li>
                          Flight Duration:{" "}
                          {connection.FirstFlight.FlightDuration}
                        </li>
                        <li>
                          Departure Date:{" "}
                          {connection.FirstFlight.DateTime.split("T")[0]}
                        </li>
                        <li>
                          Departure Time:{" "}
                          {connection.FirstFlight.DateTime.split("T")[1]}
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ConnectionFlightDisplay;
