
import type { UserType } from "../types/userType";
import apiClient from "./ApiClient";




export const getUserList = async (): Promise<UserType[]> => {
    try {
        const response = await apiClient.get("/admin/user");
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
        await apiClient.delete(`/admin/user?userId=${id}`);

    } catch (error: any) {
        if (error.response) {
            console.log("Error response data:", error, error.response.data);
            throw new Error(error.response.data || "Unable to delete user");
        }
        throw new Error("Network error");
    }
}



// Define an interface matching your backend requirements if you ever want to pass userId down the line
export interface AdminMessagePayload {
    message: string;
    userId?: string; // marked optional as per your 'nullable = true' backend configuration
}

export const sendMessageToAdmin = async (message: string): Promise<string | null> => {
    try {
        // Sending { message } matches the String message field in AdminMessageEntity
        const response = await apiClient.post("/login/sendMessageToAdmin", { message });

        // Safely extracting the success message from your custom ERP response wrapper
        const data = response.status === 200 ? response.data.erpSystemResponse.message : null;

        return data;
    } catch (error: any) {
        if (error.response) {
            console.error("Error response data:", error, error.response.data);
            // Fallback string if error.response.data isn't a direct message string
            const errorMessage = typeof error.response.data === 'string'
                ? error.response.data
                : error.response.data?.message || "Failed to submit message to admin";
            throw new Error(errorMessage);
        }
        throw new Error("Network error occurred. Please check your connection.");
    }
};