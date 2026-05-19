import { z } from "zod";

export const StudentQuestionSchema = z.object({
    query: z.string(),
    standard: z.string(),
    subject: z.string(),
    chapterNumber: z.string(),
});

export type StudentQuestionType = z.infer<typeof StudentQuestionSchema>;