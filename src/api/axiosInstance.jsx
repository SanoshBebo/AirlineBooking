import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:44329/",
});

axiosInstance.interceptors.request.use((request) => {
  const token = sessionStorage.getItem("token");
  request.headers.Authorization = `Bearer ${token}`;
  return request;
});

export default axiosInstance;
