import React from 'react'
const DirectFlightDisplay = ({data,onClick,mode}) => {
    console.log(data,onClick,mode)
    return (
        <>
          {mode == 'oneway' && ( // Check if mode is "oneway"
            <div className="">
              <ul>
                {data.map((flight) => (
                  <li
                    key={flight.ScheduleId}
                    className="flex flex-col items-start p-10 border-b border border-1 hover:cursor-pointer bg-gray-100 rounded"
                    onClick={() => onClick(flight, 'singleTrip')}
                  >
                    <p className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-purple-600">{flight.FlightName}</span>
                    </p>
                    <p>{flight.SourceAirportName}</p>
                    <p>{flight.DestinationAirportName}</p>
                    <p>{flight.FlightDuration}</p>
                    <p>{flight.DateTime}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {mode == 'roundtrip' && ( // Check if mode is "roundtrip"
            <div className="">
              <ul>
                {data.map((flight) => (
                  <li
                    key={flight.ScheduleId}
                    className="flex flex-col items-start p-10 border-b border border-1 hover:cursor-pointer bg-gray-100 rounded"
                    onClick={() => onClick(flight)}
                  >
                    <p className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-purple-600">{flight.FlightName}</span>
                    </p>
                    <p>{flight.SourceAirportName}</p>
                    <p>{flight.DestinationAirportName}</p>
                    <p>{flight.FlightDuration}</p>
                    <p>{flight.DateTime}</p>
                  </li>
                ))}
              </ul>
            </div> 
          )}
        </>
      );
      
    };



export default DirectFlightDisplay