import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

export function dbConfig() {
  return {
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "pa_app",
    password: process.env.DB_PASSWORD || "pa_app_local",
    database: process.env.DB_NAME || "pa2570",
    port: Number(process.env.DB_PORT || 3306),
    charset: "utf8mb4",
    multipleStatements: true,
  };
}

export async function createPool() {
  const pool = mysql.createPool({ ...dbConfig(), connectionLimit: 8 });
  const schema = fs.readFileSync(path.join(here, "../schema.sql"), "utf8");
  await pool.query(schema);
  return pool;
}

export async function one(pool, sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows[0] || null;
}

export async function many(pool, sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}
