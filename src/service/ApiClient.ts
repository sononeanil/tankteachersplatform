import axios from "axios";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/userType";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

apiClient.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("jwtToken");

        if (token) {
            try {
                const decoded = jwtDecode<JwtPayload>(token);

                if (decoded.exp * 1000 < Date.now()) {
                    sessionStorage.clear();
                    window.location.href = "/login";
                    return Promise.reject("Token expired");
                }
                config.headers.Authorization = `Bearer ${token}`;
            } catch {
                sessionStorage.clear();
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;

export const getUserFromToken = () => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) return null;

    try {
        return jwtDecode<JwtPayload>(token);
    } catch {
        return null;
    }
};

export const getLoggedinUserEmailId = (): string | null => {
    try {
        const token = sessionStorage.getItem("jwtToken");
        if (!token) return null;

        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.sub ?? null;
    } catch {
        return null;
    }
};