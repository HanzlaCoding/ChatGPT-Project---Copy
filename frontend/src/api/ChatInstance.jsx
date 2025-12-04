import axios from "axios";

export const chatAxios = axios.create({
  baseURL: "https://chatgpt-project-copy.onrender.com/api/chat",
});
