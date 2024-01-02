import React, { useEffect, useState } from "react";
import {
  CancelBooking,
  CancelBookingViaEmail,
  CancelPartnerBooking,
  CancelTicketsInABooking,
  CancelTicketsInPartnerBooking,
  CancelTicketsViaEmail,
  GetBookingsOfUser,
} from "../../api/Booking";
import { airlinesapi } from "../../components/Constants";
import LoaderComponent from "../../components/LoaderComponent";
import { useNavigate } from "react-router";
import SessionExpired from "../../components/SessionExpired";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false); // State to manage session expiration
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      GetBookingsOfUser(user.UserId)
        .then((res) => {
          if (res === "logout") {
            // Handle session expiration here
            setSessionExpired(true);
          } else {
            setBookings(res);
            setTimeout(() => {
              setLoaded(true);
            }, 1000);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
    else{
      navigate("/unauthorized")
    }
  }, [refresh]);

  const handleCancelTicket = async (bookingId, Name, ticket) => {
    console.log("slkdjflskdjflkdsf");
    console.log(ticket);
    console.log(bookingId, Name);
    let nameList = [Name];

    const tickets = [
      {
        TicketNo: ticket.Ticket.TicketNo,
        BookingId: ticket.Ticket.BookingId,
        FlightName: ticket.FlightSchedule
          ? ticket.FlightSchedule.FlightName
          : ticket.Ticket.FlightName,
        SourceAirportId: ticket.SourceAirport.AirportName,
        DestinationAirportId: ticket.DestinationAirport.AirportName,
        SeatNo: ticket.Ticket.SeatNo,
        Name: ticket.Ticket.Name,
        Age: ticket.Ticket.Age,
        Gender: ticket.Ticket.Gender,
        DateTime: ticket.FlightSchedule
          ? ticket.FlightSchedule.DateTime
          : ticket.Ticket.DateTime,
      },
    ];

    console.log(tickets);

    await CancelTicketsInABooking(bookingId, nameList)
      .then((res) => {
        console.log(res);
        setRefresh(!refresh);
      })
      .catch((err) => {
        console.error(err);
      });

    if (ticket.Ticket.AirlineName) {
      const ip = airlinesapi[ticket.Ticket.AirlineName];
      console.log(ip);
      await CancelTicketsInPartnerBooking(ip.apiPath, bookingId, Name)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    const user = JSON.parse(localStorage.getItem("user"));

    await CancelTicketsViaEmail(tickets, user.Email);
  };

  const handleCancelBooking = (BookingId, booking) => {
    console.log(booking);

    const tickets = booking.Tickets.map((ticket) => {
      return {
        TicketNo: ticket.Ticket.TicketNo,
        BookingId: ticket.Ticket.BookingId,
        FlightName: ticket.FlightSchedule
          ? ticket.FlightSchedule.FlightName
          : ticket.Ticket.FlightName,
        SourceAirportId: ticket.SourceAirport.AirportName,
        DestinationAirportId: ticket.DestinationAirport.AirportName,
        SeatNo: ticket.Ticket.SeatNo,
        Name: ticket.Ticket.Name,
        Age: ticket.Ticket.Age,
        Gender: ticket.Ticket.Gender,
        DateTime: ticket.FlightSchedule
          ? ticket.FlightSchedule.DateTime
          : ticket.Ticket.DateTime,
      };
    });

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

    const user = JSON.parse(localStorage.getItem("user"));

    CancelBookingViaEmail(tickets, user.Email);
  };

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-3xl font-bold mb-8 text-center">Booking History</h1>
      {sessionExpired ? (
        <SessionExpired message="Your Session Has Expired" redirectUrl="/login"  /> // Display SessionExpired component if sessionExpired is true
      ) : loaded ? (
        bookings.map((booking, index) => (
          <div
            key={index}
            className="border p-6 rounded-lg shadow-md mb-8 bg-gray-100"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Booking ID: {booking.Booking.BookingId}
              </h2>
              {booking.Booking.Status == "Cancelled" || booking.Booking.Status == "Canceled" ? (
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
              {console.log(booking)}
              {booking.Tickets.map((ticket, ticketIndex) => (
                <div
                  key={ticketIndex}
                  className="border p-4 bg-white rounded-md shadow-md relative"
                >
                  {ticket.Ticket.Status == "Booked" ? (
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
                  ) : (
                    <button
                      disabled
                      className="absolute top-2 right-2 text-sm font-semibold p-2 rounded bg-gray-500 text-white "
                    >
                      Cancelled
                    </button>
                  )}

                  <p className="font-semibold mb-2">
                    Name: {ticket.Ticket.Name}
                  </p>
                  <p className="mb-2">Ticket No: {ticket.Ticket.TicketNo}</p>
                  <p className="mb-2">Seat No: {ticket.Ticket.SeatNo}</p>
                  <p className="mb-2">Age: {ticket.Ticket.Age}</p>
                  <p className="mb-2">Gender: {ticket.Ticket.Gender}</p>
                  {ticket.FlightSchedule ? (
                    <p className="mb-2">
                      Flight Name: {ticket.FlightSchedule.FlightName}
                    </p>
                  ) : (
                    <p className="mb-2">
                      Flight Name: {ticket.Ticket.FlightName}
                    </p>
                  )}

                  <p className="mb-2">
                    Source Airport: {ticket.SourceAirport.AirportName}
                  </p>
                  <p className="mb-2">
                    Destination Airport: {ticket.DestinationAirport.AirportName}
                  </p>
                  {ticket.FlightSchedule ? (
                    <div>
                      <p className="mb-2">
                        Date: {ticket.FlightSchedule.DateTime.split("T")[0]}
                      </p>
                      <p>
                        Time: {ticket.FlightSchedule.DateTime.split("T")[1]}
                      </p>
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
        ))
      ) : (
        <LoaderComponent data="Loading Bookings" />
      )}
    </div>
  );
};

export default BookingHistory;
