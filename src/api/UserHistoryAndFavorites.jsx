import axios from "./axiosInstance";

export const GetUserHistory = async(id) => {

    try{
        const response = await axios.get(`api/HistoryAndFavorite/getuserhistory/${id}`);
        console.log(response);
        return response.data;
    }catch(error){
        console.error(error);
        throw error;
    }
}


export const AddUserHistory = async (id, reportname) => {
    try {
      const response = await axios.post(`api/HistoryAndFavorite/adduserhistory/${id}`, JSON.stringify(reportname), {
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

export const DeleteUserHistory = async(id,reportname) => {

    try{
        const response = await axios.delete(`api/HistoryAndFavorite/deleteuserhistory/${id}/${reportname}`);
        console.log(response);
        return response.data;
    }catch(error){
        console.error(error);
        throw error;
    }

    
}


export const GetUserFavorite = async(id) => {

    try{
        const response = await axios.get(`api/HistoryAndFavorite/getuserfavorites/${id}`);
        console.log(response);
        return response.data;
    }catch(error){
        console.error(error);
        throw error;
    }
}

export const AddUserFavorite = async(id,reportname) => {

    try{
        const response = await axios.post(`api/HistoryAndFavorite/adduserfavorite/${id}`,JSON.stringify(reportname), {
            headers: {
              "Content-Type": "application/json",
            },
          }
        
        );
        console.log(response);
        return response.data;
    }catch(error){
        console.error(error);
        throw error;
    }
}

export const DeleteUserFavorite = async(id,reportname) => {

    try{
        const response = await axios.delete(`api/HistoryAndFavorite/deleteuserfavorite/${id}/${reportname}`);
        console.log(response);
        return response.data;
    }catch(error){
        console.error(error);
        throw error;
    }
}