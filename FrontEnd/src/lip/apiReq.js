import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://onlinestore-backend-x1w9.onrender.com/" ,
  headers: {
    'Content-Type': 'application/json',
  },});

export default apiRequest;