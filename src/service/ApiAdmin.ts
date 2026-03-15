import axios from "axios";
import type { UserType } from "../types/userType";


const apiAdmin = axios.create({
    // baseURL: "http://localhost:8080/erpsystem"
    // baseURL: "https://tankstudentportalrestapi-production.up.railway.app/erpsystem"
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/erpsystem"
})

apiAdmin.interceptors.request.use(
    (config) => {
        const jwtToken = localStorage.getItem("jwtToken");
        if (jwtToken) {
            config.headers.Authorization = `Bearer ${jwtToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getUserList = async (): Promise<UserType[]> => {
    try {
        const response = await apiAdmin.get("/admin/user");
        const data = response.status === 200 ? response.data.erpSystemResponse.userList : []

        //const data: post[] = response.status === 200 ? response.data.posts : []
        // console.log(data)
        return data;
    } catch (error: any) {
        if (error.response) {
            console.log("Error response data:", error, error.response.data);
            throw new Error(error.response.data || "Unable to fetch user list");
        }
        throw new Error("Network error");
    }
}


export const deleteUser = async (id: number | string) => {
    try {
        await apiAdmin.delete(`/admin/user?userId=${id}`);

    } catch (error: any) {
        if (error.response) {
            console.log("Error response data:", error, error.response.data);
            throw new Error(error.response.data || "Unable to delete user");
        }
        throw new Error("Network error");
    }
}


