import axios from "./axiosInstance";

export const GetAirports = async() => {
    try{
        const response = await axios.get("api/Airports");
        console.log(response);
        return response.data;
    }catch(error){
        console.error(error);
        throw error;
    }
}

export const DeleteAirport = async(id) => {

    try{
        const response = await axios.delete(`api/Airports/${id}`);
        console.log(response);
        return response.data;
    }catch(error){
        console.error(error);
        throw error;
    }
}


export const AddAirport = async (data) => {
    try {
      const response = await axios.post(`api/Airports`, JSON.stringify(data), {
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

export const UpdateAirport = async(id) => {

    try{
        const response = await axios.put("api/Report/salesbycustomerandorderstatus");
        console.log(response);
        return response.data;
    }catch(error){
        console.error(error);
        throw error;
    }
}

