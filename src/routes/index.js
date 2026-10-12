import express from "express";
import { deviceRouter } from "./devices.router.js";

export const apiRouter = express.Router();

apiRouter.use("/devices", deviceRouter);


