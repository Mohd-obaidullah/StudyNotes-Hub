// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000",
//   timeout:10000,
//   withCredentials: true,
//   headers: { "Content-Type": "application/json" },
// });

// api.interceptors.response.use(
//   res => res,
//   err => {
//     if (err.response?.status === 401) {
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(err);
//   }
// );

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
});

// Prevent multiple redirects
let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,

  (error) => {
    // Session expired
    if (
      error.response?.status === 401 &&
      !isRedirecting
    ) {
      isRedirecting = true;

      // Google OAuth login endpoint
      window.location.href = `/auth/login`;  //window.location.href = `${import.meta.env.VITE_API_URL}/auth/login`;
    }

    return Promise.reject(error);
  }
);

export default api;