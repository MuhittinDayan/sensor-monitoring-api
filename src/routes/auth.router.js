import express from "express";
import { registerSchema } from "../validations/users.validation.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerController } from "../controllers/auth.controller.js";

export const authRouter = express.Router();
authRouter.post("/register", validate(registerSchema), registerController)