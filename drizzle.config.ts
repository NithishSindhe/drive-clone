import { defineConfig } from 'drizzle-kit';
import { env } from "@/env";

export default defineConfig({
  schema: './src/server/db/schema.ts',
  //out: './drizzle',
  dialect:'mysql',
  //driver: 'mysql2',
  dbCredentials: {
    host: env.SINGLESTORE_HOST!,
    port: Number(env.SINGLESTORE_PORT),
    user: env.SINGLESTORE_USER,
    password: env.SINGLESTORE_PASS!,
    database: env.SINGLESTORE_DB_NAME!,
  },
});