import express from "express";
import {
    createDeviceController,
    getDevicesController,
    getDeviceByIdController,
    updateDeviceController,
    deleteDeviceController
} from "../controllers/devices.controller.js";
import { createDeviceSchema, updateDeviceSchema } from "../validations/devices.validation.js";
import { validate } from "../middlewares/validate.middleware.js";
export const deviceRouter = express.Router();

deviceRouter.post("/", validate(createDeviceSchema), createDeviceController)

deviceRouter.get("/", getDevicesController)

deviceRouter.get("/:id", getDeviceByIdController)

deviceRouter.patch("/:id", validate(updateDeviceSchema), updateDeviceController)

deviceRouter.delete("/:id", deleteDeviceController) 
