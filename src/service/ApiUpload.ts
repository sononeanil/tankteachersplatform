import axios from "axios";
import apiClient from "./ApiClient";

export const uploadChapter = async (formData: FormData) => {

    try {
        const response = await apiClient.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data?.erpSystemResponse?.message || error.response.data);
            }
        }
        throw new Error("Network error " + error);
    }
};

export const getNotesApi = async () => {

    try {
        const response = await apiClient.get("/student/getNotes");
        return response.data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data?.erpSystemResponse?.message || error.response.data);
            }
        }
        throw new Error("Network error " + error);
    }
};