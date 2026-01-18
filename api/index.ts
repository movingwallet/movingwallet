/**
 * Vercel Serverless Function Entry Point
 *
 * This file serves as a bridge between Vercel's expected structure
 * and our monorepo structure at apps/gpt-backend/
 */

import { createApp } from "../apps/gpt-backend/server.js";

const { app } = createApp();

export default app;
