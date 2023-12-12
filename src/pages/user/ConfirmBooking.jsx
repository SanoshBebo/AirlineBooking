import React, { useEffect, useState } from 'react'
import { MakeBooking } from '../../api/Booking'
import userSlice, { loadUserFromStorage } from '../../redux/userSlice'
import { ChangeSeatStatus } from '../../api/Seat'
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";


const ConfirmBooking = () => {

    const [PassengerDetails, setPassengerDetails] = useState([])
    const [FlightScheduleDetails, setFlightScheduleDetails] = useState([])
    const [userData,setUserData] = useState([]);
        const navigate = useNavigate()
    
    
    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem("user"));
      const PassengerDetails = JSON.parse(sessionStorage.getItem("SingleFlightBookingInfo"));
      const FlightDetails = JSON.parse(sessionStorage.getItem("directflight"));
      setPassengerDetails(PassengerDetails);
      setFlightScheduleDetails(FlightDetails);
      console.log(PassengerDetails)
    }, [])


    const handleConfirmBooking = () =>{
        let BookingModel = [{
            Status : "Booked",
            PassengerInfos : PassengerDetails,
            UserId : userData.UserId,
            BookingType : "Onward",
            ScheduleId: FlightScheduleDetails.ScheduleId,
            DateTime : FlightScheduleDetails.DateTime,
            DestinationAirportId : FlightScheduleDetails.DestinationAirportId,
            FlightName  : FlightScheduleDetails.FlightName,
            SourceAirportId :  FlightScheduleDetails.SourceAirportId,
            AirlineName : "SanoshAirlines",
        }]
        MakeBooking(BookingModel).then((res)=>{
            console.log(res)
            sessionStorage.clear("")
            toast.success("Tickets Booked!")
            navigate("/BoookingHistory");
        }).catch((err)=>{
            console.error(err)
        })


    }


    const handleCancelBooking = () =>{
        const seats = PassengerDetails.map((passenger)=> passenger.SeatNo);
        console.log(seats)
        ChangeSeatStatus(FlightScheduleDetails.ScheduleId,"Available",seats).then((res)=>{
            console.log(res)
        }).catch((err)=>{
            console.error(err)
        })
    }


  return (
    <div className="m-5">
        <ul>
          {PassengerDetails.map((Passenger) => (
              <li
                key={Passenger.SeatNo}
                className="flex items-center border-b py-2 border border-1 p-6 m-4 hover:cursor-pointer"
                onClick={() => handleConfirmBooking()}
              >
                <p className="flex items-center space-x-2">
                  <span>{Passenger.Name}</span>
                  <span>{Passenger.SeatNo}</span>
                </p>
                {FlightScheduleDetails.FlightName} - {FlightScheduleDetails.FlightDuration} -{" "}
                {FlightScheduleDetails.SourceAirportId} - {FlightScheduleDetails.DestinationAirportId}-{FlightScheduleDetails.DateTime}
              </li>
          ))}
        </ul>
        <h1>Confirm Booking</h1>
        <button className='p-4' onClick={()=>handleConfirmBooking()}>Yes</button>
        <button className='p-4' onClick={()=>handleCancelBooking()}>No</button>
      </div>
  )
}

export default ConfirmBooking