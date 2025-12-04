import axios from "axios";

export const authAxios = axios.create({
  baseURL: "https://chatgpt-project-copy.onrender.com/api/auth",
});
