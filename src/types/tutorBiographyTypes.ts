import { z } from "zod";

export const tutorBiographySchema = z.object({
    id: z.number().optional(),

    // Basic Profile
    firstName: z
        .string()
        .min(3, "First name must be at least 3 characters"),
    lastName: z
        .string()
        .min(3, "Last name must be at least 3 characters"),
    userId: z
        .email(),

    profilePhoto: z
        .url("Profile photo must be a valid URL")
        .optional()
        .or(z.literal("")),

    headline: z
        .string()
        .min(3, "Headline must be at least 10 characters"),

    // Expertise / Teaching
    coreExpertise: z.string().optional(),
    subjectList: z.string().optional(),
    standardList: z.string().optional(),
    boardList: z.string().optional(),

    // Availability
    preferableTimings: z.array(z.string()).optional(),
    projectedNewBatch: z.array(z.string()).optional(),

    weeklyAvailability: z.string().optional(),

    // Fees
    fees: z.string().optional(),

    // Description / Qualifications
    description: z
        .string()
        .optional()
        .or(z.literal("")),

    credentials: z.string().optional(),
    qualifications: z.string().optional(),

    // Trial / Status
    trialClassAvailable: z.boolean().optional(),

    // Personal Details
    gender: z
        .string()
        .optional()
        .or(z.literal("")),

    languages: z.string().optional(),

    city: z
        .string()
        .optional()
        .or(z.literal("")),

    state: z
        .string()
        .optional()
        .or(z.literal("")),

    country: z
        .string()
        .optional()
        .or(z.literal("")),

    pincode: z
        .string()
        .optional()
        .or(z.literal("")),

    // Contact
    phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 digits"),

    emailId: z

        .email("Enter a valid email address"),

    // Security
    password: z
        .string()
        .min(3, "Password must be at least 3 characters"),

    // Timestamps
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type TutorBiographyType = z.infer<typeof tutorBiographySchema>;

export const defaultValuesTutorBiography: TutorBiographyType = {
    firstName: "",
    lastName: "",
    userId: "",
    profilePhoto: "",
    headline: "Experienced Math Tutor for CBSE students",
    coreExpertise: "Fundamental Mathematics",
    subjectList: "Mathematics, Science, English and all subjects for CBSE board",
    standardList: "IV to X",
    boardList: "cbse, icse",
    preferableTimings: ["Morning"],
    projectedNewBatch: ["May 2026"],
    weeklyAvailability: "Monday to Friday: 4 PM - 8 PM",
    fees: "Monthly: ₹5000, Quarterly: ₹14000, Yearly: ₹50000",
    description: "Passionate tutor helping students improve concept clarity.",
    credentials: "Certified Tutor, 5 years of teaching experience",
    qualifications: "M.Sc. in Mathematics",
    trialClassAvailable: false,
    gender: "",
    languages: "English, Hindi, Marathi",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    phoneNumber: "",
    emailId: "",
    password: "",
};