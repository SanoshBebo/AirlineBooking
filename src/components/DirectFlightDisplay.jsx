import React from 'react'
const DirectFlightDisplay = ({data,onClick,mode}) => {
    console.log(data,onClick,mode)
    return (
        <>
          {mode == 'oneway' && ( // Check if mode is "oneway"
            <div className="m-5">
              <ul>
                {data.map((flight) => (
                  <li
                    key={flight.ScheduleId}
                    className="flex items-center border-b py-2 border border-1 p-6 m-4 hover:cursor-pointer bg-gray-100 rounded"
                    onClick={() => onClick(flight, 'singleTrip')}
                  >
                    <p className="flex items-center space-x-2">
                      <span className="text-lg font-semibold">{flight.FlightName}</span>
                    </p>
                    {flight.SourceAirportId} - {flight.DestinationAirportId} - {flight.FlightDuration} - {flight.DateTime}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {mode == 'roundtrip' && ( // Check if mode is "roundtrip"
            <div className="m-5">
              <ul>
                {data.map((flight) => (
                  <li
                    key={flight.ScheduleId}
                    className="flex items-center border-b py-2 border border-1 p-6 m-4 hover:cursor-pointer bg-gray-100 rounded"
                    onClick={() => onClick(flight)}
                  >
                    <p className="flex items-center space-x-2">
                      <span className="text-lg font-semibold">{flight.FlightName}</span>
                    </p>
                    {flight.SourceAirportId} - {flight.DestinationAirportId} - {flight.FlightDuration} - {flight.DateTime}
                  </li>
                ))}
              </ul>
            </div> 
          )}
        </>
      );
      
    };



export default DirectFlightDisplay