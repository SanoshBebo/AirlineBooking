import axios from "./axiosInstance";

export const RegisterCall = async (registrationData) => {
  console.log("hi")
  try {
    const response = await axios.post("api/Auth/register", registrationData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data; // Return the response data
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const LoginCall = async (loginData) => {
  console.log("hi im here");
  try {
    const response = await axios.post("api/Auth/login", loginData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data.Token);
    const token = response.data.Token;
    sessionStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
