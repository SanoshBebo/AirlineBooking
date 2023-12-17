import React, { useState } from 'react'

const ConnectionFlightDisplay = ({data,onClick,mode}) => {
    console.log(data,onClick,mode)
    const [clicked, setClicked] = useState(false);

    const handleDivClick = () => {
      setClicked(!clicked);
    };
    
    return (
        <>
          {mode == "oneway" && (
            <div className="m-5">
              {data.map((connection, index) => (
                <div key={index} className="flex justify-between">
                  <div className="">
                    {connection.SecondFlight.map((flight, i) => (
                      <div
                        key={i}
                        className={`flex flex-row-reverse border p-4 rounded-md cursor-pointer  hover:bg-gray-100 my-4 transition duration-300 ease-in-out ${
                          clicked ? 'bg-green-200' : ''
                        }`}
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
                            <li>
                              Departure Date: {flight.DateTime.split("T")[0]}
                            </li>
                            <li>
                              Departure Time: {flight.DateTime.split("T")[1]}
                            </li>
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
      
          {mode == "roundtrip" && (
            <div className="m-5">
              {data.map((connection, index) => (
                <div key={index} className="flex justify-between">
                  <div className="">
                    {connection.SecondFlight.map((flight, i) => (
                      <div
                        key={i}
                        className={`flex flex-row-reverse border p-4 rounded-md cursor-pointer hover:bg-gray-100 my-4 transition duration-300 ease-in-out ${
                          clicked ? 'bg-green-200' : ''
                        }`}
                        onClick={() =>{handleDivClick();  onClick(connection.FirstFlight, flight);}
                         
                        }
                      >
                        <div className="p-5">
                          <ul>
                            <li className="font-bold text-purple-600">
                              {flight.FlightName}
                            </li>
                            <li>{flight.SourceAirportId}</li>
                            <li>{flight.DestinationAirportId}</li>
                            <li>Flight Duration: {flight.FlightDuration}</li>
                            <li>
                              Departure Date: {flight.DateTime.split("T")[0]}
                            </li>
                            <li>
                              Departure Time: {flight.DateTime.split("T")[1]}
                            </li>
                          </ul>
                        </div>
                        <div className="p-5">
                          <ul>
                            <li className="font-bold text-purple-600">
                              {connection.FirstFlight.FlightName}
                            </li>
                            <li>{connection.FirstFlight.SourceAirportId}</li>
                            <li>{connection.FirstFlight.DestinationAirportId}</li>
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
        </>
      );
}

export default ConnectionFlightDisplay