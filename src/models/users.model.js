import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        select: false
    }
}, {
    timestamps: true
})


export const User = mongoose.model("User", userSchema);