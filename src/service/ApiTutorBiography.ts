import axios from "axios";
import type { TutorBiographyPayload } from "../types/tutorBiographyTypes";
import apiClient from "./ApiClient";
import aiClient from "./AiClient";

export const mutationCreateTutorBiography = async (newTutorBiography: TutorBiographyPayload) => {

    try {
        const response = await apiClient.post("/tutor/enrolTutor", newTutorBiography);
        console.log(response.status);
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // alert(error.response.data.erpSystemResponse.message)
                throw new Error(error.response.data.erpSystemResponse.message || "Student Registration failed");
            }
        }
        throw new Error("Network error " + error);
    }
}

export const searchTutors = async (searchQuery: string) => {
    try {
        const response = await aiClient.post(
            `/learningplatform/tutorbiography/searchTutors?query=${searchQuery}`
        );

        return response.data; // ✅ no .json() in axios
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(
                    error.response.data.erpSystemResponse.message ||
                    "Unable to search tutors"
                );
            }
        }
        throw new Error("Network error " + error);
    }
};