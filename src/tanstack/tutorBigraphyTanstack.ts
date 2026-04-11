import { useMutation } from "@tanstack/react-query";
import { mutationCreateTutorBiography } from "../service/ApiTutorBiography";
import type { TutorBiographyType } from "../types/tutorBiographyTypes";

export const useCreateTutorBiography = () => {
    return useMutation({
        mutationFn: async (data: TutorBiographyType) => {
            return await mutationCreateTutorBiography(data);
        },
    });
};