import { z } from "zod";

export const courseSchema = z.object({
    id: z.number().optional(),
    courseName: z.string().min(3, "Course name must be at least 3 characters"),

    specificTopic: z.string().min(3, "Topic is required. Must be at least 3 characters"),

    batchStartTime: z.string().min(1, "Start time required"),

    numberOfDays: z.number().min(1, "Must be at least 1 day"),

    numberOfHourse: z.number().min(1, "Must be at least 30 minutes"),

    description: z.string().min(4, "Description must be at least 4 characters"),

    targatedAudience: z.string().min(3, "Target audience must be at least 3 characters"),

    modeOfDelivery: z.enum(["online", "offline", "hybrid"]),

    fee: z.number().min(0, "Fee cannot be negative"),

    prerequisite: z.string().optional(),

    organizerEmailId: z.string().optional(),
});

export type PublishCourseType = z.infer<typeof courseSchema>;


export const registerCourseSchema = z.object({
    id: z.number().optional(),
    courseId: z.number(),
    organizerEmailId: z.string(),
    studentEmailId: z.string()
});

export type RegisterCourseType = z.infer<typeof registerCourseSchema>;