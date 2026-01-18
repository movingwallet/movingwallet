/**
 * Vercel Serverless Function Entry Point
 *
 * This file serves as a bridge between Vercel's expected structure
 * and our monorepo structure at apps/gpt-backend/
 */

import handler from "../apps/gpt-backend/server";

export default handler;
