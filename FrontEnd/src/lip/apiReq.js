import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://localhost:8888/" ,
  headers: {
    'Content-Type': 'application/json',
  },});

export default apiRequest;