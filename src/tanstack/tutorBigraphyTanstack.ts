import { useMutation } from "@tanstack/react-query";
import { mutationCreateTutorBiography } from "../service/ApiTutorBiography";
import type { TutorBiographyPayload } from "../types/tutorBiographyTypes";

export const useCreateTutorBiography = () => {
    return useMutation({
        mutationFn: async (data: TutorBiographyPayload) => {
            return await mutationCreateTutorBiography(data);
        },
    });
};