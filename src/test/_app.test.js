import { describe, it, expect } from '@jest/globals';
import request from "supertest";
import { app } from "../app.js";

describe("POST /api/auth/logout", () => {
    it("should return status 200 OK", async () => {
        const res = await request(app).post("/api/auth/logout");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({message: "User logged out successfully"});
    });
});