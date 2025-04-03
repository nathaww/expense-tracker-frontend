import { makeReq } from "@/makeReq";
import { LoginInterface } from "./_models";

export const loginUser = async (credentials: LoginInterface) => {
  const response = await fetch("https://expense-tracker-backend-csxl.onrender.com/auth/login", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include'
  });
  return response.json();
};
