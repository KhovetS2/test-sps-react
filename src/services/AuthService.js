import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const cookieOptions = {
    sameSite: "Strict",
    secure: window.location.protocol === "https:",
};

class AuthService {
    async login(email, password) {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            email,
            password,
        });

        const { access_token, refresh_token, user } = response.data;

        // Save tokens and user in cookies
        Cookies.set("access_token", access_token, cookieOptions);
        Cookies.set("refresh_token", refresh_token, cookieOptions);
        Cookies.set("user", JSON.stringify(user), cookieOptions);

        return { access_token, refresh_token, user };
    }

    async refresh() {
        const refreshToken = Cookies.get("refresh_token");

        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = response.data;

        Cookies.set("access_token", access_token, cookieOptions);
        Cookies.set("refresh_token", refresh_token, cookieOptions);

        return { access_token, refresh_token };
    }

    async logout() {
        const refreshToken = Cookies.get("refresh_token");

        try {
            if (refreshToken) {
                await axios.post(`${BASE_URL}/auth/logout`, {
                    refresh_token: refreshToken,
                });
            }
        } finally {
            // Always clear cookies even if API call fails
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            Cookies.remove("user");
        }
    }

    getUser() {
        const userStr = Cookies.get("user");
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }

    isAuthenticated() {
        return !!Cookies.get("access_token");
    }
}

const authService = new AuthService();
export default authService;
