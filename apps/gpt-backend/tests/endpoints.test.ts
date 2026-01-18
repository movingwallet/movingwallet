import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../server";

describe("Basic Endpoints", () => {
  const { app } = createApp();

  describe("GET /health", () => {
    it("should return 200 and health status", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "ok");
      expect(response.body).toHaveProperty("traceId");
      expect(response.body).toHaveProperty("serverless");
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  describe("POST /api/ping", () => {
    it("should return 200 and pong message", async () => {
      const response = await request(app).post("/api/ping");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "pong");
      expect(response.body).toHaveProperty("traceId");
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  describe("GET /api/debug/ai", () => {
    it("should return 200 and debug info", async () => {
      const response = await request(app).get("/api/debug/ai");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("traceId");
      expect(response.body).toHaveProperty("env");
      expect(response.body).toHaveProperty("serverless");
      expect(response.body).toHaveProperty("timestamp");
    });

    it("should check for API keys in env", async () => {
      const response = await request(app).get("/api/debug/ai");

      expect(response.body.env).toHaveProperty("OPENAI_API_KEY");
      expect(response.body.env).toHaveProperty("ANTHROPIC_API_KEY");
      expect(response.body.env).toHaveProperty("GITHUB_TOKEN");
    });
  });

  describe("404 Handler", () => {
    it("should return 404 for unknown routes", async () => {
      const response = await request(app).get("/unknown-route");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Not Found");
      expect(response.body).toHaveProperty("path", "/unknown-route");
      expect(response.body).toHaveProperty("traceId");
    });
  });
});
