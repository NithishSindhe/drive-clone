import { drizzle } from 'drizzle-orm/mysql2';
import { createPool, type Pool } from "mysql2/promise";

import { env } from "@/env";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { conn: Pool | undefined; };

export const conn: Pool =
  globalForDb.conn ??
  createPool({
    host: env.SINGLESTORE_HOST,
    port: parseInt(env.SINGLESTORE_PORT),
    user: env.SINGLESTORE_USER,
    password: env.SINGLESTORE_PASS,
    database: env.SINGLESTORE_DB_NAME,
    ssl: {},
    maxIdle: 0,
  });
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

conn.addListener("error", (err) => {
  console.error("Database connection error:", err);
});

//test connection to database
const pool = createPool({
  host: env.SINGLESTORE_HOST,
  port: parseInt(env.SINGLESTORE_PORT),
  user: env.SINGLESTORE_USER,
  password: env.SINGLESTORE_PASS,
  database: env.SINGLESTORE_DB_NAME,
  ssl: {}, // optional for SingleStore Cloud
  maxIdle: 0,
});

async function testDbConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Successfully connected to SingleStore.");
    conn.release();
  } catch (error) {
    console.error("❌ Failed to connect to SingleStore:", error);
  }
}

testDbConnection();

export const db = drizzle(conn, { schema,mode: "default" });
