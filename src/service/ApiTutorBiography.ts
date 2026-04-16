import axios from "axios";
import type { TutorBiographyPayload } from "../types/tutorBiographyTypes";
import apiClient from "./ApiClient";

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
