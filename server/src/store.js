import bcrypt from "bcryptjs";
import { config } from "./config.js";
import { many, one } from "./db.js";
import { CC_ITEMS, WORKLOADS } from "./sourceRules.js";

export async function getUserByUsername(pool, username) {
  return one(pool, "SELECT * FROM users WHERE username = ?", [username]);
}

export async function getUser(pool, id) {
  return one(pool, "SELECT * FROM users WHERE id = ?", [id]);
}

export async function listUsers(pool) {
  return many(pool, "SELECT * FROM users ORDER BY id");
}

export function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    role: row.role,
    track: row.track,
    fullName: row.full_name,
    position: row.position_name,
    staffId: row.staff_id,
    personType: row.person_type,
    department: row.department_name,
    facultyName: row.faculty_name,
    email: row.email,
    supervisorId: row.supervisor_id,
    startDate: row.start_date,
  };
}

export async function ensureRound(pool, year) {
  if (!config.years.includes(String(year))) {
    const error = new Error("ปีงบประมาณไม่อยู่ใน config");
    error.status = 400;
    throw error;
  }
  await pool.query(
    "INSERT IGNORE INTO rounds (fiscal_year, calendar_dates, round_pattern) VALUES (?, 'SOURCE_MISSING', 'SOURCE_MISSING')",
    [String(year)],
  );
  return one(pool, "SELECT * FROM rounds WHERE fiscal_year = ?", [String(year)]);
}

export async function ensureSkeleton(pool, userId, roundId) {
  const forms = [
    ["PA", "draft", 1],
    ["CC", "draft", 1],
    ["IDP", "draft", 1],
    ["FC", "draft", 0],
    ["MC", "draft", 0],
  ];
  for (const [formType, status, enabled] of forms) {
    await pool.query(
      `INSERT IGNORE INTO evaluation_sets (user_id, round_id, form_type, status, enabled)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, roundId, formType, status, enabled],
    );
  }
  for (const workload of WORKLOADS) {
    await pool.query(
      `INSERT IGNORE INTO workloads (user_id, round_id, group_no, group_id, title)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, roundId, workload.no, workload.id, workload.title],
    );
  }
  for (const item of CC_ITEMS) {
    await pool.query(
      `INSERT IGNORE INTO competency_scores
        (user_id, round_id, competency_type, code, name)
       VALUES (?, ?, 'CC', ?, ?)`,
      [userId, roundId, item.code, item.name],
    );
  }
  await pool.query(
    "INSERT IGNORE INTO score_reviews (user_id, round_id) VALUES (?, ?)",
    [userId, roundId],
  );
}

export async function getSet(pool, userId, roundId, formType) {
  return one(
    pool,
    "SELECT * FROM evaluation_sets WHERE user_id = ? AND round_id = ? AND form_type = ?",
    [userId, roundId, formType],
  );
}

export async function loadPa(pool, userId, roundId) {
  const workloads = await many(
    pool,
    "SELECT * FROM workloads WHERE user_id = ? AND round_id = ? ORDER BY group_no",
    [userId, roundId],
  );
  const ids = workloads.map((row) => row.id);
  const agreements = ids.length
    ? await many(pool, `SELECT * FROM agreements WHERE workload_id IN (${ids.map(() => "?").join(",")}) ORDER BY id`, ids)
    : [];
  const agreementIds = agreements.map((row) => row.id);
  const indicators = agreementIds.length
    ? await many(
        pool,
        `SELECT * FROM indicators WHERE agreement_id IN (${agreementIds.map(() => "?").join(",")}) ORDER BY id`,
        agreementIds,
      )
    : [];
  return workloads.map((workload) => ({
    ...workload,
    agreements: agreements
      .filter((agreement) => agreement.workload_id === workload.id)
      .map((agreement) => ({
        ...agreement,
        indicators: indicators.filter((indicator) => indicator.indicator_id === undefined && indicator.agreement_id === agreement.id),
      })),
  }));
}

export function scoreAllowed(value, bounds) {
  if (value === null || value === undefined || value === "") return false;
  const number = Number(value);
  return Number.isFinite(number) && number >= bounds.selfScoreMin && number <= bounds.selfScoreMax;
}

export async function seedIfEmpty(pool) {
  const existing = await one(pool, "SELECT COUNT(*) AS n FROM users");
  if (existing.n > 0) return;
  const password = await bcrypt.hash(process.env.SEED_PASSWORD || "Pa-seed-2570", 10);
  const faculty = config.facultyName;
  const sample = config.sampleRatee;
  const [head] = await insertUser(pool, {
    username: "unit.head",
    password,
    role: "head",
    track: null,
    full_name: "หัวหน้างาน (บัญชีตัวอย่าง)",
    position_name: "หัวหน้างาน",
    faculty_name: faculty,
  });
  const [first] = await insertUser(pool, {
    username: "first.head",
    password,
    role: "firstHead",
    track: null,
    full_name: "หัวหน้างานขั้นต้น (บัญชีตัวอย่าง)",
    position_name: "หัวหน้างานขั้นต้น",
    faculty_name: faculty,
    supervisor_id: head.insertId,
  });
  await insertUser(pool, {
    username: sample.username,
    password,
    role: "faculty",
    track: sample.track,
    full_name: sample.full,
    position_name: sample.position,
    staff_id: sample.staffId,
    faculty_name: faculty,
    supervisor_id: first.insertId,
  });
  await insertUser(pool, {
    username: "support.ratee",
    password,
    role: "support",
    track: "support",
    full_name: "ผู้รับการประเมินสายสนับสนุน (บัญชีตัวอย่าง)",
    position_name: "เจ้าหน้าที่",
    faculty_name: faculty,
    supervisor_id: first.insertId,
  });
  await insertUser(pool, {
    username: "hr.desk",
    password,
    role: "hr",
    track: null,
    full_name: "ฝ่ายบุคคลากร (บัญชีตัวอย่าง)",
    position_name: "ฝ่ายบุคคลากร",
    faculty_name: faculty,
  });
  await insertUser(pool, {
    username: "uni.admin",
    password,
    role: "admin",
    track: null,
    full_name: "Admin มหาวิทยาลัย (บัญชีตัวอย่าง)",
    position_name: "Admin มหาวิทยาลัย",
    faculty_name: faculty,
  });
}

async function insertUser(pool, row) {
  return pool.query(
    `INSERT INTO users
      (username, password_hash, role, track, full_name, position_name, staff_id, faculty_name, supervisor_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      row.username,
      row.password,
      row.role,
      row.track,
      row.full_name,
      row.position_name,
      row.staff_id || null,
      row.faculty_name,
      row.supervisor_id || null,
    ],
  );
}

export async function resetDatabase(pool) {
  await pool.query(
    "SET FOREIGN_KEY_CHECKS=0; TRUNCATE score_reviews; TRUNCATE competency_scores; TRUNCATE indicators; TRUNCATE agreements; TRUNCATE workloads; TRUNCATE idp_items; TRUNCATE research_int; TRUNCATE research_notice; TRUNCATE evaluation_sets; TRUNCATE rounds; TRUNCATE users; SET FOREIGN_KEY_CHECKS=1;",
  );
}
