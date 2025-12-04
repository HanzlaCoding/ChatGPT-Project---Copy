import axios from "axios";

export const chatAxios = axios.create({
  baseURL: "http://localhost:3000/api/chat",
});
