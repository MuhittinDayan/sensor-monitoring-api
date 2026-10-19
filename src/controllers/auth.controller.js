import { registerService } from "../services/auth.service.js"

export const registerController = async (req, res) => {
    const { email, password } = req.body;

    const newUser = await registerService(email, password);


    return res.status(201).json({
        message: "User successfully created", data: newUser
    })
}