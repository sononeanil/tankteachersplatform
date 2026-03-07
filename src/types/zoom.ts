
import { z } from "zod";

export const createZoomMeeting = z.object({
    id: z.number().optional(),

    meetingTopic: z
        .string()
        .min(3, "Meeting topic must be at least 3 characters"),

    startTime: z
        .string()
        .min(1, "Start time is required"),

    duration: z
        .string()
        .min(1, "Duration is required"),

    password: z
        .string()
        .min(4, "Password must be at least 4 characters"),
    organizerEmail: z
        .string()
        .optional(),
});

export type CreateZoomMeetingType = z.infer<typeof createZoomMeeting>;
