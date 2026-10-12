import app from "../src/app.js";
import mongoose from "mongoose";
import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { Device } from "../src/models/devices.model.js";

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/sensor-api-test");
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

describe("POST /api/v1/devices", () => {

    it("should return 201 and create a device with a valid name", async () => {
        // Arrange
        const name = "test-001";

        // Act
        const res = await request(app)
            .post("/api/v1/devices")
            .send({ name });

        // Assert
        expect(res.status).toBe(201);
        expect(res.body.data.name).toBe(name);
    });

    it("should return 400 when name is missing", async () => {
        // Act
        const res = await request(app)
            .post("/api/v1/devices")
            .send({});

        // Assert
        expect(res.status).toBe(400);
        expect(res.body.message).toContain("Name is required.");
    });

    it("should return 400 when name is not string", async () => {
        const res = await createDevice(12345);

        expect(res.status).toBe(400);
        expect(res.body.message).toContain("Name must be a string");
    })

    it("should return 400 when name length must be 50 character or less", async () => {
        const res = await createDevice("a".repeat(51));

        expect(res.status).toBe(400);
        expect(res.body.message).toContain("Name must be at 50 character or less");
    })
    it("should trim leading and trailing spaces from device name", async () => {
        const res = await createDevice("     testttt        ");
        expect(res.status).toBe(201);
        expect(res.body.data.name).toContain("testttt");
    })
});

describe("GET /api/v1/devices", () => {

    it("should return 200 and an empty array when no devices exist", async () => {
        // Act
        const res = await request(app)
            .get("/api/v1/devices");

        // Assert
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual([]);
    });


    it()
});