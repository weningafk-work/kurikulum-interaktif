import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/services/api_neon.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});