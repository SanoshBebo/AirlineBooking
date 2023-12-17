import axios from "axios";
import axiosInstance from "./axiosInstance";

export const GetBookingsOfUser = async(userid) => {
    try{
        const response = await axiosInstance.get(`api/Bookings/userbookings/${userid}`);
        console.log(response);
        return response.data;
    }catch(error){
        console.error(error);
        throw error;
    }
}


export const GetBookingIdDetails = async(bookingid) => {
  try{
      const response = await axiosInstance.get(`api/Bookings/${bookingid}`);
      console.log(response);
      return response.data;
  }catch(error){
      console.error(error);
      throw error;
  }
}

export const GetConnectionTickets = async(bookingid) => {
  console.log(bookingid)
  try{
      const response = await axiosInstance.get(`api/Bookings/getConnectionBooking/${bookingid}`);
      console.log(response);
      return response.data;
  }catch(error){
      console.error(error);
      throw error;
  }
}

export const MakeBooking = async (bookings) => {
    try {
      const response = await axiosInstance.post(`api/Bookings`, JSON.stringify(bookings), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const MakePartnerBooking = async (booking) => {
    try {
      const response = await axiosInstance.post(`api/Bookings/partnerbookings`, JSON.stringify(booking), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const CancelBooking = async (bookingid) => {
    try {
      const response = await axiosInstance.patch(`api/Bookings/cancelbooking/${bookingid}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const CancelPartnerBooking = async (ip,bookingid) => {
    console.log(ip,bookingid)
    try {
      const response = await axios.patch(`${ip}Integration/cancelpartnerbooking/${bookingid}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const CancelTicketsInABooking = async (bookingid,passengernames) => {
    console.log(bookingid,passengernames)
    try {
      const response = await axiosInstance.patch(`api/Bookings/canceltickets/${bookingid}`,JSON.stringify(passengernames), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  
  export const CancelTicketsInPartnerBooking = async (ip,bookingid,passengernames) => {
    try {
      console.log(ip,bookingid,passengernames)
      const response = await axios.patch(`${ip}Integration/cancelticketsinpartnerbooking/${bookingid}`,JSON.stringify(passengernames), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

