import axios from "./axiosInstance";



export const GetAllFlightSchedules = async() => {
    try{
        const response = await axios.get("api/FlightSchedules");
        console.log(response);
        return response.data;
    }catch(error){
        console.error(error);
        throw error;
    }
}

export const GetDirectFlightSchedule = async(source,destination,dateTime) => {
    try{
        const response =  await axios.get(`api/FlightSchedules/${source}/${destination}/${dateTime.toISOString()}`);
        console.log(response);
        return response.data;
    }catch(error){
        console.error(error);
        throw error;
    }
}

export const GetConnectingFlightSchedule = async(source,destination,dateTime) => {
    try{
        const response =  await axios.get(`api/FlightSchedules/${source}/${destination}/${dateTime.toISOString()}`);
        console.log(response);
        return response.data;
    }catch(error){
        console.error(error);
        throw error;
    }
}

export const GetExactFlightSchedule = async(scheduleid) => {
    try{
        const response = await axios.get(`api/FlightSchedules${scheduleid}`);
        console.log(response);
        return response.data;
    }catch(error){
        console.error(error);
        throw error;
    }
  }


export const AddScheduleForMonths = async (schedule,months) => {
    try {
      const response = await axios.post(`api/FlightSchedules/${months}`, JSON.stringify(schedule), {
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


export const DeleteSchedules = async (idsToDelete) => {
    try {
        const response = await axios.delete('api/FlightSchedules', {
          data: JSON.stringify(idsToDelete),
          headers: {
            'Content-Type': 'application/json', 
          },
        });
        console.log('Flight schedules deleted:', response.data);
      } catch (error) {
        console.error('Error deleting flight schedules:', error);
      }
  };


  export const UpdateFlightSchedule = async (id,flightSchedule) => {
    try {
      const response = await axios.put(`api/FlightSchedules/${id}`, JSON.stringify(flightSchedule), {
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

