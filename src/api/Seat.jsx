import axios from "axios";

export const GetSeatsForSchedule = async (ip,scheduleid) => {
  try {
    const response = await axios.get(`${ip}Integration/seats/${scheduleid}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const ChangeSeatStatus = async (ip,scheduleId, status, seatNumbers) => {
  try {
    const response = await axios.patch(
      `${ip}Integration/changeseatstatus/${scheduleId}/${status}`,
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
