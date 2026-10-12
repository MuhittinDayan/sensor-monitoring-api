import {
    createDeviceService,
    getDevicesService,
    getDeviceByIdService,
    updateDeviceService,
    deleteDeviceService
} from "../services/devices.service.js"
const createDeviceController = async (req, res) => {
    const { name, isActive } = req.body;
    const newDevice = await createDeviceService({
        name, isActive
    });
    return res.status(201).json({
        message: ("Device successfully created. "), data: newDevice
    });

}

const getDevicesController = async (req, res) => {
    const result = await getDevicesService();

    return res.status(200).json({
        message: ("Devices successfully listed."), data: result
    })
}

const getDeviceByIdController = async (req, res) => {
    const { id } = req.params;
    const result = await getDeviceByIdService(id);

    return res.status(200).json({
        message: ("Device successfully retrieved."), data: result
    });
}
const updateDeviceController = async (req, res) => {
    const { id } = req.params;
    const { name, isActive } = req.body;
    const result = await updateDeviceService(id, name, isActive);

    return res.status(200).json({
        message: ("Device successfully updated"), data: result
    })
}

const deleteDeviceController = async (req, res) => {
    const { id } = req.params;
    await deleteDeviceService(id);

    return res.status(204).send();
}
export {
    createDeviceController,
    getDevicesController,
    getDeviceByIdController,
    updateDeviceController,
    deleteDeviceController
}