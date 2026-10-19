import { User } from "../models/users.model.js";
import { AppError } from "../utils/AppError.js";
import bcrypt from "bcryptjs";

export const registerService = async (email, password) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) { throw new AppError("Email is already registered.", 409) };

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        email, password: hashedPassword
    })

    return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
    };
}