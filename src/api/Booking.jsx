import axios from "./axiosInstance";

export const GetBookingsOfUser = async(userid) => {
    try{
        const response = await axios.get(`api/Bookings/userbookings/${userid}`);
        console.log(response);
        return response.data;
    }catch(error){
        console.error(error);
        throw error;
    }
}


export const GetBookingIdDetails = async(bookingid) => {
  try{
      const response = await axios.get(`api/Bookings/${bookingid}`);
      console.log(response);
      return response.data;
  }catch(error){
      console.error(error);
      throw error;
  }
}

export const MakeBooking = async (bookings) => {
    try {
      const response = await axios.post(`api/Bookings`, JSON.stringify(bookings), {
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
      const response = await axios.post(`api/Bookings/partnerbookings`, JSON.stringify(booking), {
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
      const response = await axios.put(`api/Bookings/cancelbooking/${bookingid}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const CancelPartnerBooking = async (bookingid) => {
    try {
      const response = await axios.put(`api/Bookings/cancelpartnerbooking/${bookingid}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const CancelTicketsInABooking = async (bookingid,passengernames) => {
    try {
      const response = await axios.put(`api/Bookings/canceltickets/${bookingid}`,JSON.stringify(passengernames), {
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

  
  export const CancelTicketsInPartnerBooking = async (bookingid,passengernames) => {
    try {
      const response = await axios.put(`api/Bookings/cancelticketsinpartnerbooking/${bookingid}`,JSON.stringify(passengernames), {
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

