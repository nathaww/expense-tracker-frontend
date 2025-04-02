import { makeReq } from "@/makeReq";
import { LoginInterface } from "./_models";

export const loginUser = async (credentials: LoginInterface) => {
  const response = await makeReq.post("/auth/login", credentials, {
    withCredentials: true,
  });
  return response.data;
};
