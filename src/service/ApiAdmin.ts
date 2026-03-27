
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


