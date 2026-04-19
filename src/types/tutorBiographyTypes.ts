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
    preferableTimings: z.string().optional(),
    projectedNewBatch: z.string().optional(),

    weeklyAvailability: z.string().optional(),

    // Fees
    dailyFees: z.number().optional(),
    weeklyFees: z.number().optional(),
    monthlyFees: z.number().optional(),
    quarterlyFees: z.number().optional(),
    yearlyFees: z.number().optional(),

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

});

export type TutorBiographyType = z.infer<typeof tutorBiographySchema>;

export const defaultValuesTutorBiography: TutorBiographyType = {
    firstName: "",
    lastName: "",
    userId: "",
    profilePhoto: "",
    headline: "Experienced Math Tutor for CBSE students",
    coreExpertise: "Board Exam Preparation, Olympiad Coaching, Concept Clarity, Weak Student Support",
    subjectList: "Mathematics, Science, English and all subjects for CBSE board",
    standardList: "IV,V, VI, VII, VIII, IX, X",
    boardList: "cbse, icse",
    preferableTimings: "Morning: 8 AM - 11 AM, Evening: 5 PM - 9 PM",
    projectedNewBatch: "",
    weeklyAvailability: "Monday to Friday: 4 PM - 8 PM, Saturday: 10 AM - 2 PM, Sunday: 10 AM - 2 PM",
    dailyFees: 500,
    weeklyFees: 2000,
    monthlyFees: 7000,
    quarterlyFees: 20000,
    yearlyFees: 75000,
    description: "Passionate tutor helping students improve concept clarity.",
    credentials: "5+ Years Teaching Experience,Olympiad Mentor,95% Student Success Rate",
    qualifications: "M.Sc. in Mathematics, B.Sc. in Physics, B.Ed.",
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

export type TutorBiographyPayload = Omit<
    TutorBiographyType,
    | "dailyFees"
    | "weeklyFees"
    | "monthlyFees"
    | "quarterlyFees"
    | "yearlyFees"
    | "coreExpertise"
    | "subjectList"
    | "standardList"
    | "boardList"
    | "languages"
    | "preferableTimings"
    | "weeklyAvailability"
    | "credentials"
    | "qualifications"
> & {
    fees: {
        daily: number | null;
        weekly: number | null;
        monthly: number | null;
        quarterly: number | null;
        yearly: number | null;
    };
    coreExpertise?: string[];
    subjectList?: string[];
    standardList?: string[];
    boardList?: string[];
    languages?: string[];
    preferableTimings?: string[];
    weeklyAvailability?: string[];
    credentials?: string[];
    qualifications?: string[];
};