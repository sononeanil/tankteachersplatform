import apiClient from "./ApiClient";

// Interface for the parameters (if using TypeScript)
interface NoteParams {
    classNumber: string | number;
    subject: string;
    chapterNumber: string | number;
}

export const generateDetailedScienceNotes = async ({ classNumber, subject, chapterNumber }: NoteParams) => {
    try {
        const response = await apiClient.post("/gemmaai/notes/generateDetailedScienceNotes", {
            classNumber,
            subject,
            chapterNumber
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(
                error.response.data.erpSystemResponse?.message ||
                "Unable to Register for course. Please try again later."
            );
        }
        throw new Error("Network error while fetching available courses. Please check your connection and try again.");
    }
};
