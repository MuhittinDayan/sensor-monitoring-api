import express from "express";
import { deviceRouter } from "./devices.router.js";
import { authRouter } from "./auth.router.js";

export const apiRouter = express.Router();

apiRouter.use("/devices", deviceRouter);
apiRouter.use("/auth", authRouter);


