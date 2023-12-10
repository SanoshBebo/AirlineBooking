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


export const GetFlightDetail = async(id) => {
  try{
      const response = await axios.get(`api/FlightDetails/${id}`);
      console.log(response);
      return response.data;
  }catch(error){
      console.error(error);
      throw error;
  }
}

export const AddFlight = async (data) => {
    try {
      const response = await axios.post(`api/FlightDetails`, JSON.stringify(data), {
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

  export const UpdateFlight = async (id,data) => {
    console.log("im here")
    console.log(id);
    console.log(data);
    try {
      const response = await axios.put(`api/FlightDetails/${id}`, JSON.stringify(data), {
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

