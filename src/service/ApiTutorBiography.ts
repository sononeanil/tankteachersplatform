import axios from "axios";
import aiClient from "./AiClient";
import type { TutorBiographyType } from "../types/tutorBiographyTypes";
import apiClient from "./ApiClient";

export const mutationCreateTutorBiography = async (newTutorBiography: TutorBiographyType) => {

    try {
        const response = await apiClient.post("/", newTutorBiography);
        //console.log(response.status);
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
