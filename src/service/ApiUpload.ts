import axios from "axios";
import apiClient from "./ApiClient";
import aiClient from "./AiClient";

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

export const getNotesPDFApi = async () => {

    try {
        const response = await apiClient.get("/student/getNotesPDF");
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

export const uploadPDFChapter = async (formData: FormData) => {
    try {
        const response = await aiClient.post("/genai/pdf", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("AI Response:", response.data);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(
                    error.response.data?.erpSystemResponse?.message ||
                    error.response.data
                );
            }
        }
        throw new Error("Network error " + error);
    }
};