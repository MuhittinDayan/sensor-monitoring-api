import { z } from "zod";

export const registerSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string({
        error: (issue) => issue.input === undefined
            ? "Password is required."
            : "Password must be a string."
    })
        .min(8, "Password must be at least 8 characters")
        .max(72, "Password must be at most 72 characters")
})