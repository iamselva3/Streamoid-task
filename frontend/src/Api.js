// // src/Api.js
// import axios from "axios";

// const Api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL, // your backend URL
//   withCredentials: false,               // or true if you use cookies
// });

// // OPTIONAL: Add default headers
// Api.defaults.headers.common["Content-Type"] = "application/json";

// // OPTIONAL: Add auth token if needed
// // Api.interceptors.request.use((config) => {
// //   const token = localStorage.getItem("token");
// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`;
// //   }
// //   return config;
// // });

// export default Api;


// src/Api.js
import axios from 'axios';
const Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});
Api.defaults.headers.common['Content-Type'] = 'application/json';
Api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default Api;
