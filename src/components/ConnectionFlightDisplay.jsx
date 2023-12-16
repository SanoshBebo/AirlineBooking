import React from 'react'

const ConnectionFlightDisplay = ({data,onClick,mode}) => {
    console.log(data,onClick,mode)

  return (
    <>
    {mode == "oneway" && ( // Check if mode is "oneway"
    <div className="m-5">
            {data.map((connection, index) => (
              <div key={index} className="flex justify-between">
                <div className="">
                  {connection.SecondFlight.map((flight, i) => (
                    <div
                      key={i}
                      className="flex flex-row-reverse border p-2 hover:cursor-pointer m-5"
                      onClick={() =>
                        onClick(flight, connection.FirstFlight, "connectingTrip")
                      }
                    >
                      <div className="p-5">
                        <ul>
                          <li>{flight.FlightName}</li>
                          <li>{flight.SourceAirportId}</li>
                          <li>{flight.DestinationAirportId}</li>
                          <li>Flight Duration: {flight.FlightDuration}</li>
                          <li>
                            DepartureDate: {flight.DateTime.split("T")[0]}
                          </li>
                          <li>
                            DepartureTime: {flight.DateTime.split("T")[1]}
                          </li>
                        </ul>
                      </div>
                      <div className="p-5">
                        <ul>
                          <li>{connection.FirstFlight.FlightName}</li>
                          <li>{connection.FirstFlight.SourceAirportId}</li>
                          <li>{connection.FirstFlight.DestinationAirportId}</li>
                          <li>
                            Flight Duration:{" "}
                            {connection.FirstFlight.FlightDuration}
                          </li>
                          <li>
                            DepartureDate:{" "}
                            {connection.FirstFlight.DateTime.split("T")[0]}
                          </li>
                          <li>
                            DepartureTime:{" "}
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
    {mode == "roundtrip" && ( // Check if mode is "roundtrip"
    <div className="m-5">
    {data.map((connection, index) => (
      <div key={index} className="flex justify-between">
        <div className="">
          {connection.SecondFlight.map((flight, i) => (
            <div
              key={i}
              className="flex flex-row-reverse border p-2 hover:cursor-pointer m-5 "
              onClick={() =>
                onClick(
                  connection.FirstFlight,
                  flight
                )
              }
            >
              <div className="p-5">
                <ul>
                  <li>{flight.FlightName}</li>
                  <li>{flight.SourceAirportId}</li>
                  <li>{flight.DestinationAirportId}</li>
                  <li>Flight Duration: {flight.FlightDuration}</li>
                  <li>
                    DepartureDate: {flight.DateTime.split("T")[0]}
                  </li>
                  <li>
                    DepartureTime: {flight.DateTime.split("T")[1]}
                  </li>
                </ul>
              </div>
              <div className="p-5">
                <ul>
                  <li>{connection.FirstFlight.FlightName}</li>
                  <li>{connection.FirstFlight.SourceAirportId}</li>
                  <li>
                    {connection.FirstFlight.DestinationAirportId}
                  </li>
                  <li>
                    Flight Duration:{" "}
                    {connection.FirstFlight.FlightDuration}
                  </li>
                  <li>
                    DepartureDate:{" "}
                    {connection.FirstFlight.DateTime.split("T")[0]}
                  </li>
                  <li>
                    DepartureTime:{" "}
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
  )
}

export default ConnectionFlightDisplay