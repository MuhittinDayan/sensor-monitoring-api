import { z } from "zod";

export const createDeviceSchema = z.object({
    name: z.string({
        error: (issue) =>
            issue.input === undefined
                ? "Name is required."
                : "Name must be a string"
    })
        .trim().min(1, { message: "Name cannot be empty" }).max(50, { message: "Name must be at 50 character or less" }),
    isActive: z.boolean().optional()
});


export const updateDeviceSchema = z.object({
    name: z.string({
        error: (issue) =>
            issue.input === undefined
                ? "Name is required."
                : "Name must be a string"
    })
        .trim().min(1, { message: "Name cannot be empty" }).max(50, { message: "Name must be at 50 character or less" }).optional(),
    isActive: z.boolean().optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided." }
)
