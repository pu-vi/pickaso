import { defineConfig, env } from "prisma/config";
import { loadEnvFile } from "process";

loadEnvFile();

export default defineConfig({
  datasource: {
    url: env("DATABASE_URL"),
  },
});
