import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://localhost:44329/",
  baseURL: "http://192.168.10.102:81/",
});

axiosInstance.interceptors.request.use((request) => {
  const token = sessionStorage.getItem("token");
  request.headers.Authorization = `Bearer ${token}`;
  return request;
});

export default axiosInstance;
