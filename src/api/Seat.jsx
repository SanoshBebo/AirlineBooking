import axios from "./axiosInstance";

export const GetSeatsForSchedule = async (scheduleid) => {
  try {
    const response = await axios.get(`api/Seats/${scheduleid}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const ChangeSeatStatus = async (scheduleId, status, seatNumbers) => {
  try {
    const response = await axios.put(
      `api/Seats/${scheduleId}/${status}`,
      JSON.stringify(seatNumbers),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
