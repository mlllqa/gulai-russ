// src/api/axios.js
import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "http://localhost:8000",       // Laravel
  withCredentials: true,                  // главное: включить передачу куки
  xsrfCookieName: "XSRF-TOKEN",           // название куки с токеном
  xsrfHeaderName: "X-XSRF-TOKEN",         // заголовок, в который он пойдет
});

// Подхватываем токен XSRF из куки (для надёжности)
instance.interceptors.request.use((config) => {
  const token = Cookies.get("XSRF-TOKEN");
  if (token) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
  }
  return config;
});

export default instance;
