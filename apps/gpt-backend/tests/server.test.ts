import { describe, it, expect } from "vitest";
import { createApp } from "../server";

describe("Server Creation", () => {
  it("should create app without errors", () => {
    const { app, PORT } = createApp();

    expect(app).toBeDefined();
    expect(PORT).toBeDefined();
  });

  it("should have correct environment settings", () => {
    const { app } = createApp();

    expect(app.locals.envLoadedFrom).toBeDefined();
    expect(app.locals.SERVERLESS).toBeDefined();
  });
});
