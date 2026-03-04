import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
});

// Request interceptor: inject access_token from cookie
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: auto-refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not a refresh/login request, try to refresh
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/")
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = Cookies.get("refresh_token");

            if (!refreshToken) {
                isRefreshing = false;
                // Clear all auth cookies and redirect
                Cookies.remove("access_token");
                Cookies.remove("refresh_token");
                Cookies.remove("user");
                window.location.href = "/signin";
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_SERVER_URL}/auth/refresh`,
                    { refresh_token: refreshToken }
                );

                const { access_token, refresh_token } = response.data;

                Cookies.set("access_token", access_token, {
                    sameSite: "Strict",
                    secure: window.location.protocol === "https:",
                });
                Cookies.set("refresh_token", refresh_token, {
                    sameSite: "Strict",
                    secure: window.location.protocol === "https:",
                });

                processQueue(null, access_token);

                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                Cookies.remove("access_token");
                Cookies.remove("refresh_token");
                Cookies.remove("user");
                window.location.href = "/signin";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
