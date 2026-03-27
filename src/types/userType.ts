import { z } from "zod";


export const loginSchema = z.object({
    id: z.number().optional(),
    userId: z.email(),
    password: z.string().min(3),
})

export type LoginType = z.infer<typeof loginSchema>;

export const userSchema = z.object({
    id: z.number().optional(),
    // firstName: z.string().min(3),
    // lastName: z.string().min(3),
    // address: z.string().min(3).optional(),
    // city: z.string().min(3).optional(),
    // country: z.string().min(5).optional(),
    // newsLetter: z.string().optional(),
    email: z.email().min(5),
    password: z.string().min(3),
    phoneNumber: z.string().min(10),
    alternateEmailId:
        z.email("Invalid email")
            .or(z.literal(""))
})

export type UserType = z.infer<typeof userSchema>;



// Schema
export const studentSchema = z.object({
    id: z.number().optional(),
    loginId: z.string(),
    password: z.string().min(3, "Password mandatory with more than 3 characters"),
    firstName: z.string().min(3, "firstName Mandatory attribute with more than 3 characters"),
    lastName: z.string().min(3),
    nickName: z.string().min(3).optional().or(z.literal("")),
    email: z.email().optional().or(z.literal("")),
    age: z.coerce.number().min(1, "Age is mandatory and has to be greater than zero"),
    classEntrolled: z.string().min(3).optional().or(z.literal("")),
    middleName: z.string().min(3).optional().or(z.literal("")),
    gender: z.string().min(3),
    subjectEnrolled: z.string().min(3).optional().or(z.literal("")),
    attendancePercentage: z.string().optional().or(z.literal("")),
    dateOfBirth: z.string().optional().or(z.literal("")),
    dateOfAdmission: z.string().optional().or(z.literal("")),
    parentId: z.string().min(1).optional().or(z.literal("")),
});

// ✅ Infer type from schema (output type)
export type StudentType = z.infer<typeof studentSchema>;

export const publishUpload = z.object({
    id: z.number().optional(),
    type: z.string().optional(),
    term: z.string().optional(),
})


export type PublishUploadType = z.infer<typeof publishUpload>;


export const metaDataSchema = z.object({
    id: z.number().optional(),
    key: z.string().min(3).optional().transform(valueEntered => valueEntered === "" ? undefined : valueEntered),
    value: z.string().min(3).optional().transform(valueEntered => valueEntered === "" ? undefined : valueEntered),
})

export type MetaDataType = z.infer<typeof metaDataSchema>;

export const userRoleSchema = z.object({
    id: z.number().optional(),
    emailId: z.string().min(5).optional().transform(valueEntered => valueEntered === "" ? undefined : valueEntered),
    userRoles: z.string().optional(),
    sytemRoles: z.string().optional(),
})

export type UserRoleType = z.infer<typeof userRoleSchema>;

export const updateUserRoleSchema = z.object({
    userId: z.number(),
    rolesList: z.string()
})

export type UpdateUserRoleType = z.infer<typeof updateUserRoleSchema>;

export type JwtPayload = {
    sub: string;
    roles: string[];
    exp: number; // 👈 important
};