import app from "../src/app.js";
import mongoose from "mongoose";
import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { Device } from "../src/models/devices.model.js";

beforeAll(async () => {
    if (!process.env.MONGODB_URI_TEST_DEVICE?.includes("test")) {
        throw new Error("MONGODB_URI_TEST_DEVICE must point to a test database.");
    }
    await mongoose.connect(process.env.MONGODB_URI_TEST_DEVICE);
});

beforeEach(async () => {
    await Device.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});

const createDevice = async (name) => {
    const res = await request(app)
        .post("/api/v1/devices")
        .send({ name })

    return res;
}
const getDevices = async () => {
    const res = await request(app)
        .get("/api/v1/devices");
    return res;
}

const getDevice = async (id) => {

    const res = await request(app)
        .get(`/api/v1/devices/${id}`);
    return res;

}
const updateDevice = async (id, data) => {
    const res = await request(app)
        .patch(`/api/v1/devices/${id}`)
        .send(data);
    return res;
}
const deleteDevice = async (id) => {
    const res = await request(app)
        .delete(`/api/v1/devices/${id}`)
    return res;
}


describe("POST /api/v1/devices", () => {

    it("should return 201 and create a device with a valid name", async () => {
        // Arrange
        const name = "test-001";

        // Act
        const res = await createDevice(name);

        // Assert
        expect(res.status).toBe(201);
        expect(res.body.data.name).toBe(name);
    });

    it("should return 400 when name is missing", async () => {
        // Act
        const res = await createDevice();

        // Assert
        expect(res.status).toBe(400);
        expect(res.body.message).toContain("Name is required.");
    });

    it("should return 400 when name is not string", async () => {
        const res = await createDevice(12345);

        expect(res.status).toBe(400);
        expect(res.body.message).toContain("Name must be a string");
    })

    it("should return 400 when name exceeds 50 characters", async () => {
        const res = await createDevice("a".repeat(51));

        expect(res.status).toBe(400);
        expect(res.body.message).toContain("Name must be at 50 character or less");
    })
    it("should trim leading and trailing spaces from device name", async () => {
        const res = await createDevice("     testttt        ");
        expect(res.status).toBe(201);
        expect(res.body.data.name).toBe("testttt");
    })
});

describe("GET /api/v1/devices", () => {

    it("should return 200 and an empty array when no devices exist", async () => {
        // Act
        const res = await getDevices();

        // Assert
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual([]);
    });


    it("should return a list containing two devices after creating two devices", async () => {
        await createDevice("device-1");
        await createDevice("device-2");

        const res = await getDevices();
        expect(res.body.data.length).toBe(2);
    })
});

describe("GET /api/v1/devices/:id", () => {
    it("should return 200 and the correct name when the device exists", async () => {
        const device = await createDevice("test-device");
        const id = device.body.data._id;
        const res = await getDevice(id);
        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe("test-device");
    })
    it("should return 404 when the device does not exist", async () => {
        // formatı geçerli yeni bir id üretilecek
        const id = new mongoose.Types.ObjectId().toString();

        const res = await getDevice(id);
        expect(res.status).toBe(404)
    })
    it("should return 400 when device Id format is invalid ", async () => {
        const id = "abc";

        const res = await getDevice(id);
        expect(res.status).toBe(400);
        expect(res.body.message).toContain("Invalid ID format.")
    })
});

describe("PATCH /devices/:id", () => {
    it("should return 200 and the updated name when the device is updated", async () => {
        const device = await createDevice("test");
        const id = device.body.data._id;
        const res = await updateDevice(
            id, { name: "updated-device", isActive: false }
        );

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe("updated-device");
        expect(res.body.data.isActive).toBe(false);
    })
    it("should preserve the existing name when only isActive is updated", async () => {
        const device = await createDevice("test");
        const id = device.body.data._id;
        const res = await updateDevice(
            id, { isActive: false }
        );

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe("test");
        expect(res.body.data.isActive).toBe(false);
    })

    it("should return 400 when body is empty", async () => {
        const device = await createDevice("test");
        const id = device.body.data._id;
        const res = await updateDevice(id, {});

        expect(res.status).toBe(400);
    })
    it("should return 404 when the device does not exist", async () => {
        const id = new mongoose.Types.ObjectId().toString();
        const res = await updateDevice(
            id, { name: "aa", isActive: true }
        );

        expect(res.status).toBe(404);
    })

});
describe("DELETE /devices/:id", () => {
    it("should return 204 when device deleted", async () => {
        const device = await createDevice("test");
        const id = device.body.data._id;
        const res = await deleteDevice(id);

        expect(res.status).toBe(204);
        const deletedId = await getDevice(id);

        expect(deletedId.status).toBe(404);
    })
    it("should return 404 when the device does not exist", async () => {
        const id = new mongoose.Types.ObjectId().toString();
        const res = await deleteDevice(id);

        expect(res.status).toBe(404);
    })
});
