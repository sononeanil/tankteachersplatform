import z, { number } from "zod";

export type post = {

    id: number;
    title: string;
    body: string;
    userId: number;
    views: number;

}

export const createCustomerSchema = z.object(
    {
        id: number(),
        name: z.string().min(3),
        phonenumber: z.string().min(10),
        location: z.string().optional(),
        budget: z.string().optional(),
        specification: z.string().optional()
    }
);

export type customer = z.infer<typeof createCustomerSchema>;