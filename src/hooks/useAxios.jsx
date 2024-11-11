import axios from "axios";
//https://nrb-server.vercel.app
const axiosSecure = axios.create({
  baseURL: "https://nrb-server.vercel.app",
});
const useAxios = () => {
  return axiosSecure;
};

export default useAxios;
