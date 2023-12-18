import React, { useEffect, useState } from "react";
import {
  CancelBooking,
  CancelPartnerBooking,
  CancelTicketsInABooking,
  CancelTicketsInPartnerBooking,
  GetBookingsOfUser,
} from "../../api/Booking";
import { airlinesapi } from "../../components/Constants";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    GetBookingsOfUser(user.UserId)
      .then((res) => {
        console.log(res);
        setBookings(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

  const handleCancelTicket = (bookingId, Name, ticket) => {
    console.log(ticket);
    console.log(bookingId, Name);
    let nameList = [Name];

    CancelTicketsInABooking(bookingId, nameList)
      .then((res) => {
        console.log(res);
        setRefresh(!refresh);
      })
      .catch((err) => {
        console.error(err);
      });

    if (ticket.Ticket.AirlineName) {
      console.log("first");
      const ip = airlinesapi[ticket.Ticket.AirlineName];
      console.log(ip);
      CancelTicketsInPartnerBooking(ip.apiPath, bookingId, Name)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleCancelBooking = (BookingId, booking) => {
    console.log(booking);

    CancelBooking(BookingId)
      .then((res) => {
        console.log(res);
        setRefresh(!refresh);
      })
      .catch((err) => {
        console.error(err);
      });

    booking.Tickets.map((ticket) => {
      console.log("first");
      if (
        ticket.Ticket.AirlineName &&
        ticket.Ticket.AirlineName != "SanoshAirlines"
      ) {
        const airline = airlinesapi[ticket.Ticket.AirlineName];
        CancelPartnerBooking(airline.apiPath, BookingId)
          .then((res) => {
            console.log(res);
            setRefresh(!refresh);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Booking History</h1>
      {bookings.map((booking, index) => (
        <div
          key={index}
          className="border p-6 rounded-lg shadow-md mb-8 bg-gray-100"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Booking ID: {booking.Booking.BookingId}
            </h2>
            {booking.Booking.Status == "Canceled" ? (
              <button
                disabled
                className="text-sm font-semibold py-2 px-4 rounded bg-gray-500 text-white "
              >
                Cancelled
              </button>
            ) : (
              <button
                className="text-sm font-semibold py-2 px-4 rounded bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:bg-red-600 transition duration-300"
                onClick={() => {
                  handleCancelBooking(booking.Booking.BookingId, booking);
                }}
              >
                Cancel Booking
              </button>
            )}
          </div>
          <p className="mb-2">Status: {booking.Booking.Status}</p>
          <p className="mb-2">User ID: {booking.Booking.UserId}</p>
          <p className="mb-2">Booking Type: {booking.Booking.BookingType}</p>
          <h3 className="text-lg font-semibold mb-4 mt-6">Tickets:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {booking.Tickets.map((ticket, ticketIndex) => (
              <div
                key={ticketIndex}
                className="border p-4 bg-white rounded-md shadow-md relative"
              >
                <button
                  className="absolute top-2 right-2 text-sm font-semibold text-red-500 hover:text-red-600 focus:outline-none"
                  onClick={() =>
                    handleCancelTicket(
                      booking.Booking.BookingId,
                      ticket.Ticket.Name,
                      ticket
                    )
                  }
                >
                  Cancel Ticket
                </button>
                <p className="font-semibold mb-2">Name: {ticket.Ticket.Name}</p>
                <p className="mb-2">Ticket No: {ticket.Ticket.TicketNo}</p>
                <p className="mb-2">Schedule ID: {ticket.Ticket.ScheduleId}</p>
                <p className="mb-2">Seat No: {ticket.Ticket.SeatNo}</p>
                <p className="mb-2">Age: {ticket.Ticket.Age}</p>
                <p className="mb-2">Gender: {ticket.Ticket.Gender}</p>
                {ticket.FlightSchedule ? (
                  <p className="mb-2">
                    Flight Name: {ticket.FlightSchedule.FlightName}
                  </p>
                ) : (
                  <p className="mb-2">Flight Name: {ticket.FlightName}</p>
                )}

                <p className="mb-2">
                  Source Airport: {ticket.SourceAirport.AirportName}
                </p>
                <p className="mb-2">
                  Destination Airport: {ticket.DestinationAirport.AirportName}
                </p>
                {/* <p className="mb-2">
                  Flight Duration: {ticket.FlightSchedule.FlightDuration}
                </p> */}
                {ticket.FlightSchedule ? (
                  <div>
                    <p className="mb-2">
                      Date: {ticket.FlightSchedule.DateTime.split("T")[0]}
                    </p>
                    <p>Time: {ticket.FlightSchedule.DateTime.split("T")[1]}</p>
                  </div>
                ) : (
                  <div>
                    <p className="mb-2">
                      Date: {ticket.Ticket.DateTime.split("T")[0]}
                    </p>
                    <p>Time: {ticket.Ticket.DateTime.split("T")[1]}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingHistory;
