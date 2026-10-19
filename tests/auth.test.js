import app from "../src/app.js";
import mongoose from "mongoose";
import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { User } from "../src/models/users.model.js";
import bcrypt from "bcryptjs";

beforeAll(async () => {
    if (!process.env.MONGODB_URI_TEST_AUTH?.includes("test")) {
        throw new Error("MONGODB_URI_TEST_AUTH must point to a test database.");
    }
    await mongoose.connect(process.env.MONGODB_URI_TEST_AUTH);
    await User.init();
})
beforeEach(async () => {
    await User.deleteMany({});
})
afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
})
const createUser = async (email, password) => {
    const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ email, password });
    return res;
}
describe("POST /api/v1/auth/register", () => {
    it("should return 201 when user is created", async () => {
        const email = "test1@test.com";
        const password = "12345678";
        const res = await createUser(email, password);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("User successfully created");
    })

    it("should return 409 when user email is not unique", async () => {
        const email = "test@test.com";
        const password = "12345678";
        await createUser(email, password);
        const res = await createUser(email, password);

        expect(res.status).toBe(409);
        expect(res.body.message).toBe("Email is already registered.");
    })
    it("should return 400 when email is missing", async () => {
        const password = "12345678";
        const res = await createUser(undefined, password);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid email address");
    })
    it("should return 400 when email is not a string", async () => {
        const email = 12;
        const password = "12345678";
        const res = await createUser(email, password);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid email address");
    })
    it("should return 400 when email is empty", async () => {
        const email = "";
        const password = "12345678";
        const res = await createUser(email, password);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid email address");
    })
    it("should return 400 when email format is invalid", async () => {
        const email = "test";
        const password = "12345678";
        const res = await createUser(email, password);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid email address");
    })
    it("should return 400 when password is missing", async () => {
        const email = "test@test.com";
        const res = await createUser(email);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Password is required.");
    })
    it("should return 400 when password is not a string", async () => {
        const email = "test@test.com";
        const password = 12345678;
        const res = await createUser(email, password);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Password must be a string.");
    })
    it("should return 400 when password is empty", async () => {
        const email = "test@test.com";
        const password = "";
        const res = await createUser(email, password);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Password must be at least 8 characters");
    })
    it("should return 400 when password is shorter than 8 characters", async () => {
        const email = "test@test.com";
        const password = "1234567";
        const res = await createUser(email, password);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Password must be at least 8 characters");
    })
    it("should return the created user's id in the response", async () => {
        const email = "test@test.com";
        const password = "12345678";
        const user = await createUser(email, password);
        expect(user.status).toBe(201);
        expect(user.body.data.id).toBeDefined();
    })
    it("should return 201 when password is exactly 72 characters", async () => {
        const email = "test@test.com";
        const password = "a".repeat(72);
        const res = await createUser(email, password);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("User successfully created");
    })
    it("should return 400 when password is longer than 72 characters", async () => {
        const email = "test@test.com";
        const password = "a".repeat(73);
        const res = await createUser(email, password);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Password must be at most 72 characters");
    })
    it("should store the email in lowercase", async () => {
        const email = "Test@test.com";
        const password = "12345678";
        const res = await createUser(email, password)
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("User successfully created");
        expect(res.body.data.email).toBe("test@test.com");
    })
    it("should not return the password in the response", async () => {
        const email = "test@test.com";
        const password = "12345678";
        const res = await createUser(email, password);
        expect(res.status).toBe(201);
        expect(res.body.data.password).toBeUndefined();
    })
    it("should return 409 when the same email is registered with different letter casing", async () => {
        const email = "TEST@TEST.COM";
        const password = "12345678";
        await createUser(email, password);
        const email_2 = "test@test.com";
        const res = await createUser(email_2, password);
        expect(res.status).toBe(409);
        expect(res.body.message).toBe("Email is already registered.");
    })
    it("should store the password as a bcrypt hash, not plain text", async () => {
        const email = "test@test.com";
        const password = "12345678";
        await createUser(email, password);
        const stored = await User.findOne({ email }).select("+password");

        expect(stored.password).not.toBe(password);

        const matches = await bcrypt.compare(password, stored.password);
        expect(matches).toBe(true);
    })
})