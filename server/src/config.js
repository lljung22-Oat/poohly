import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export function loadConfig() {
  const file = path.join(root, "pa-config.json");
  const config = JSON.parse(fs.readFileSync(file, "utf8"));
  if (config.stack?.backend?.chosen !== "Express") {
    throw new Error("stack.backend.chosen ต้องเป็น Express");
  }
  if (config.stack?.database?.engine !== "MySQL") {
    throw new Error("ฐานข้อมูลต้องเป็น MySQL");
  }
  if (config.stack?.backend?.parallelImplementations !== false) {
    throw new Error("ห้ามสร้างส่วนบริการคู่ขนาน");
  }
  return config;
}

export const config = loadConfig();
export const projectRoot = root;
