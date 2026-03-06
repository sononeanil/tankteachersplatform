import z from "zod";

export const studentSchema = z.object({
    id: z.number().optional(),
    firstName: z.string().min(3, "First name should be at least 3 characters long")
        .max(20, "First name should be at most 20 characters long"),
    lastName: z.string().min(3, "Last name should be at least 3 characters long")
        .max(20, "Last name should be at most 20 characters long"),
    nickName: z.string().min(3, "Nick name should be at least 3 characters long").optional,
    age: z.number().min(3, "Age should be at least 3").max(100, "Age should be at most 100"),
    email: z.email("Invalid email address"),
    enrollmentDate: z.string().optional(),
    class: z.string().min(10, "Class should be at least 10 characters long"),
    dateOfBirth: z.string().optional()
});

export type student = z.infer<typeof studentSchema>;