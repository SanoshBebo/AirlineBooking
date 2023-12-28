import axios from "axios";

const axiosIntegratedInstance = axios.create();

axiosIntegratedInstance.interceptors.request.use((request) => {
  const token = sessionStorage.getItem("token");
  request.headers.Authorization = `Bearer ${token}`;
  return request;
});

export default axiosIntegratedInstance;
