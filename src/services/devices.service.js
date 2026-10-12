import { Device } from "../models/devices.model.js"
import { AppError } from "../utils/AppError.js";

const createDeviceService = async ({ name, isActive }) => {
    const device = await Device.create({
        name, isActive
    });

    return device;
}

const getDevicesService = async () => {
    const devices = await Device.find();

    return devices;
}

const getDeviceByIdService = async (id) => {
    const searchedDevice = await Device.findById(id);
    if (!searchedDevice) throw new AppError("The requested device was not found.", 404);

    return searchedDevice;
}
const updateDeviceService = async (id, name, isActive) => {
    const updatedDevice = await Device.findByIdAndUpdate(
        id,
        { $set: { name, isActive } },
        { returnDocument: "after", runValidators: true }

    );
    if (!updatedDevice) throw new AppError("The requested device was not found.", 404);
    return updatedDevice;
}

const deleteDeviceService = async (id) => {
    const deletedDevice = await Device.findByIdAndDelete(id);
    if (!deletedDevice) throw new AppError("The requested device was not found.", 404);

    return deletedDevice;
}

export {
    createDeviceService,
    getDevicesService,
    getDeviceByIdService,
    updateDeviceService,
    deleteDeviceService
}