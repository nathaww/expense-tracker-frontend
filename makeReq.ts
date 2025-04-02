import axios from "axios";

export const makeReq = axios.create({
  baseURL: "https://expense-tracker-backend-csxl.onrender.com",
});
  