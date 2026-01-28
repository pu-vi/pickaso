import { defineConfig, env } from "prisma/config";
import { loadEnvFile } from "process";

try {
  loadEnvFile();
} catch {
  // .env file not found - this is expected in production/deployment environments
}

export default defineConfig({
  datasource: {
    url: env("DATABASE_URL"),
  },
});
