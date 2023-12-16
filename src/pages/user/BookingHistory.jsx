import React, { useEffect, useState } from 'react';
import { GetBookingsOfUser } from '../../api/Booking';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    GetBookingsOfUser(user.UserId)
      .then((res) => {
        console.log(res);
        setBookings(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleCancelTicket = () =>{
    console.log("handleCancelTicket");
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Booking History</h1>
      {bookings.map((booking, index) => (
        <div key={index} className="border p-4 mb-4 bg-zinc-300">
          <div className='justify-between flex flex-row'>

          <h2 className="text-xl font-bold mb-2">Booking ID: {booking.Booking.BookingId}</h2>
          <button className="text-xl font-bold mb-2">Cancel Booking</button>
          </div>
          <p>Status: {booking.Booking.Status}</p>
          <p>User ID: {booking.Booking.UserId}</p>
          <p>Booking Type: {booking.Booking.BookingType}</p>

            <h3 className="text-lg font-semibold mb-2">Tickets:</h3>
            <div className="mt-4 flex-row flex gap-4">
              {booking.Tickets.map((ticket, ticketIndex) => (
                <div key={ticketIndex} className="border p-2 bg-slate-100 mb-2 hover:cursor-pointer">
                   <button
            className="absolute top-0 right-0 text-red-500 cursor-pointer"
            onClick={() => handleCancelTicket(ticket)}
          >
            X
          </button>
                  <p>Ticket No: {ticket.Ticket.TicketNo}</p>
                  <p>Schedule ID: {ticket.Ticket.ScheduleId}</p>
                  <p>Seat No: {ticket.Ticket.SeatNo}</p>
                  <p>Name: {ticket.Ticket.Name}</p>
                  <p>Age: {ticket.Ticket.Age}</p>
                  <p>Gender: {ticket.Ticket.Gender}</p>
                  <p>Flight Name: {ticket.FlightSchedule.FlightName}</p>
                  <p>Source Airport: {ticket.SourceAirport.AirportName}</p>
                  <p>Destination Airport: {ticket.DestinationAirport.AirportName}</p>
                  <p>Flight Duration: {ticket.FlightSchedule.FlightDuration}</p>
                  <p>Date Time: {ticket.FlightSchedule.DateTime}</p>
                </div>
              ))}
            </div>
        </div>
      ))}
    </div>
  );
};

export default BookingHistory;
