import mongoose from "mongoose";

export const deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required."],
        trim: true,
        maxlength: [50, "Name must not exceed 50 characters."]
    },
    isActive: {
        type: Boolean,
        default: true
    },
},
    {
        timestamps: true
    },
)


export const Device = mongoose.model("Device", deviceSchema);