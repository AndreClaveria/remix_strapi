import axios from "axios";

export const BASE_URL = "http://localhost:1337/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
